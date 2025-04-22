import { exec } from "child_process";
import path from "path";

export const runMLModel = async (req, res) => {
  const scriptPath = path.join(__dirname, "../../ml-api/ml_model.py");

  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: stderr });
    }
    res.status(200).json({ result: stdout });
  });
};
