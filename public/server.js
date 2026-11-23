require("dotenv").config({ quiet: true });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const express = require("express");
const cors = require("cors");

// Middleware 
const app = express();
const Port = 4000;
app.use(express.json());
app.use(cors());

// const { incidents, reporters } = require("./data");
// let nextId = 10;
// no longer needed because we now have a database and we are not using the data.js file again

// Welcome Endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the backend API")
});

// Get Reporter or All Incidents Endpoint
app.get("/api/incidents", async (req, res) => {
    let query = supabase.from("incidents").select("*").order("reported_on", { ascending: false });
    if (req.query.reporter_code) {
        query = query.eq("reporter_code", req.query.reporter_code);
    }

    const { data, error } = await query;
    if (error) {
        return res.status(400).json({ message: error });
    }
    res.json(data);
});


// Get single Incident by ID Endpoint
app.get("/api/incidents/:id", async (req, res) => {

    const { error, data } = await supabase.from("incidents").select("*").eq("id", req.params.id).maybeSingle();
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    if (!data) {
        return res.status(404).json({ message: "Incident not found" });
    }
    res.json(data);
});


// Create an Incident Endpoint
app.post("/api/incidents", async (req, res) => {
    const { title, type, lga, community, description, severity, status, reporter_code } = req.body;
    if (!title || !type || !lga || !community || !description) {
        return res.status(404).json({ message: "Please fill in every field" })
    }
    const reporter = await supabase.from("reporters").select("id").eq("code", reporter_code).maybeSingle();
    if (!reporter) {
        return res.status(401).json({ message: "Please sign in before sending a report" })
    }

    const { data, error } = await supabase.from("incidents").insert({
        title: title,
        type: type,
        lga: lga,
        community: community,
        description: description,
        severity: severity,
        status: status,
        reporter_code: reporter_code,
    }).select().single();
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    res.status(201).json(data);
});

// Update incident Endpoint
app.put("/api/incidents/:id", async (req, res) => {
    if (req.get("x-admin-key") !== process.env.ADMIN_KEY) {
        return res.status(401).json({ message: "Unauthorized Request - Staff Key is missing or wrong" });
    }
    const { data, error } = await supabase.from("incidents").update({
        status: req.body.status,
        status_reason: req.body.status_reason || ""
    }).eq("id", req.params.id).select().maybeSingle();

    if (error) {
        return res.status(400).json({ message: error.message });
    }
    if (!data) {
        return res.status(404).json({ message: "Incident not found" });
    }

    res.json(data);
});


//Delete incident Endpoint
app.delete("/api/incidents/:id", async (req, res) => {
    if (req.get("x-admin-key") !== process.env.ADMIN_KEY) {
        return res.status(401).json({ message: "Unauthorized Request - Staff Key is missing or wrong" });
    }
    const { data, error } = await supabase.from("incidents").delete().eq("id", req.params.id).select().maybeSingle();
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    if (!data) {
        return res.status(404).json({ message: "Incident not found" });
    }
    res.json({ message: "Incident deleted successfully" });
});


// Reporter endpoint
app.get("/api/reporters", (req, res) => {
    res.json(reporters);
});

// Reporter signup endpoint
app.post("/api/reporters/signup", async (req, res) => {
    // to make sure that all required fields are filled
    const { name, phone, community } = req.body;
    if (!name || !phone || !community) {
        return res.status(400).json({ message: "Please fill in every field" });
    }

    // to check if the phone number already exists in the database
    const existing_reporter = await supabase.from("reporters").select("id").eq("phone", phone).maybeSingle();

    if (existing_reporter.data) {
        return res.status(400).json({ message: "That Phone number already has an account" });
    }

    // to generate the reporter code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    const { data, error } = await supabase.from("reporters").insert({
        name: name, phone: phone, community: community, code: code
    }).select().single();

    if (error) {
        return res.status(400).json({ message: error.message });
    }
    return res.status(201).json(data);
});

// Reporter login endpoint
app.post("/api/reporters/login", async (req, res) => {
    const { data, error } = await supabase.from("reporters").select("*")
        .eq("phone", req.body.phone)
        .eq("code", req.body.code).maybeSingle();

    if (error) {
        return res.status(400).json({ message: error.message });
    }
    if (!data) {
        return res.status(401).json({ message: "Invalid Reporter Credentials" })
    }
    res.json(data);
});

// Server listening status
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
}); 