require("dotenv").config({ quiet: true });
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const express = require("express");
const cors = require("cors");

// middleware
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors());

// const {incidents, reporters} = require("./data");
// const data = require("./data");
// let nextId = 10;

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("welcome to the backend API");
});

// Get All reporter all incidents
app.get("/api/incidents", async (req, res) => {
  let query = supabase
    .from("incidents")
    .select("*")
    .order("reported_on", { ascending: false });
  if (req.query.reporter_code) {
    query = query.eq("reporter_code", req.query.reporter_code);
  }

  const { data, error } = await query;
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  res.json(data);
});
// Get single incident by id Endppoint
app.get("/api/incidents/:id", async (req, res) => {
  const { errror, data } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();
  if (errror) {
    return res.status(400).json({ message: "error.message" });
  }
  if (!data) {
    return res.status(404).json({ message: "Incident not found" });
  }
  res.json(data);
});

// create a new endpoint incident
app.post("/api/incidents", async (req, res) => {
  const {
    title,
    type,
    lga,
    community,
    description,
    severity,
    status,
    reporter_code,
  } = req.body;

  // Validation
  if (!title || !type || !lga || !community || !description || !severity) {
    return res.status(400).json({ message: "Please fill in every field" });
  }
  const reporter = await supabase
    .from("reporters")
    .select("id")
    .eq("code", reporter_code)
    .maybeSingle();
  if (!reporter) {
    return res
      .status(401)
      .json({ message: "Please sign in before sending a report" });
  }
  const { data, error } = await supabase
    .from("incidents")
    .insert({
      title: title,
      type: type,
      lga: lga,
      community: community,
      description: description,
      severity: severity,
      status: status,
      reporter_code: reporter_code,
    })
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: "error.message" });
  }

  res.status(201).json(data);
});

//  Update an endpoint Incidents
app.put("/api/incidents/:id", async (req, res) => {
  if (req.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return res
      .status(401)
      .json({
        message: "Unauthorized Request - Staff key is missing or wrong ",
      });
  }

  const { data, error } = await supabase
    .from("incidents")
    .update({
      status: req.body.status,
      status_reason: req.body.status_reason || "",
    })
    .eq("id", req.params.id)
    .select()
    .maybeSingle();

  if (error) {
    return res.status(400).json({ message: "error.message" });
  }
  if (!data) {
    return res.status(404).json({ message: "incident not found" });
  }

  res.json(data);
});

// Delete endpoint Incidents
app.delete("/api/incidents/:id", async (req, res) => {
  if (req.get("x-admin-key") !== process.env.ADMIN_KEY) {
    return res
      .status(401)
      .json({
        message: "Unauthorized Request - Staff key is missing or wrong",
      });
  }
  const { data, error } = await supabase
    .from("incidents")
    .delete()
    .eq("id", req.params.id)
    .select()
    .maybeSingle();

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Incident not found" });
  }
  res.json({ message: "Incident deleted successfully." });
});

// Reporter Endpoint
app.get("/api/reporters", (req, res) => {
  res.json(reporters);
});

//  SignUp endpoint
app.post("/api/reporters/signup", async (req, res) => {
  const { name, phone, community } = req.body;
  if (!name || !phone || !community) {
    return res.status(400).json({ message: "Please fill in every Field" });
  }
  // checking if the endpoint exist in the database
  const existing_reporter = await supabase
    .from("reporters")
    .insert()
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing_reporter.data) {
    return res
      .status(409)
      .json({
        message: "Reporter with this phone Number already has an account!",
      });
  }
  // to generate the reporter code
  const code = String(Math.floor(100000 + Math.random() * 900000));

  const { data, error } = await supabase
    .from("reporters")
    .insert({ name: name, phone: phone, community: community, code: code })
    .select()
    .single();

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Incorrect Reporter Credentials" });
  }
  res.status(201).json(data);
});

//  Reporter login endpoint
app.post("/api/reporters/login", async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({
        Success: false,
        message: "Please provide phone and code",
      });
    }

    const { data, error } = await supabase
      .from("reporters")
      .select("*")
      .eq("phone", req.body.phone)
      .eq("code", req.body.code)
      .maybeSingle();

      console.log(data, error);
      
    if (error) {
      return res.status(400).json({ message: "error.message" });
    }
    if (!data) {
      return res.status(401).json({ message: "Invalid Reporter Credentials" });
    }
    // Successful login
    return res.status(200).json({
        Success:true,
        message: "Successfully Login",
        reporter: {
            id: data.id,
            name: data.name,
            phone: data.phone,
        }
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
        Success: false,
        message: "Something went wrong, Please try again"
    })
  }

});
// server listener endpoint
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
