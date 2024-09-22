import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

type FormidablePromise = {
  fields: formidable.Fields;
  files: formidable.Files;
};

// Utility function to parse form data in a promise-based way
const parseForm = async (req: NextApiRequest): Promise<FormidablePromise> => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Parse the form data (name and image)
      const { fields, files } = await parseForm(req);

      // Handle name: Check if it's an array, and if so, take the first element
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;

      // Ensure files.image exists and is a single File
      const image = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!name || !image) {
        return res.status(400).json({ error: "Name and image are required" });
      }

      // Define the directory to save the uploaded image
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Ensure the directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Get the file extension and set the destination path
      const ext = path.extname(image.originalFilename || "");
      const fileName = `${Date.now()}-${name}${ext}`; // Create unique file name
      const filePath = path.join(uploadDir, fileName);

      // Move the uploaded file to the desired directory
      fs.renameSync(image.filepath, filePath);

      // Optionally, save the person's name in a text file
      const namesFilePath = path.join(uploadDir, "names.txt");
      fs.appendFileSync(namesFilePath, `Name: ${name}, Image: ${fileName}\n`);

      // Respond with the file URL
      return res.status(200).json({
        message: "Person added successfully",
        name,
        imageUrl: `/uploads/${fileName}`,
      });
    } catch (error) {
      console.error("Error processing form:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
