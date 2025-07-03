import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUpload, FaFileExcel, FaFileDownload } from "react-icons/fa";

function BulkUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      await axios.post(
        "http://localhost:5000/api/uploads/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Users uploaded successfully");
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
      const fileInput = document.getElementById("excelFile");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast.loading("Downloading template...");
      const response = await axios.get(
        "http://localhost:5000/api/uploads/download-template",
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss();
      toast.error("Failed to download template");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Bulk Upload Users</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload User File
        </label>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50">
                <FaFileExcel className="mr-2 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {file ? file.name : "Select file"}
                </span>
                <input
                  id="excelFile"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                title="Download template"
              >
                <FaFileDownload className="mr-1" />
                <span className="text-sm">Template</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            <FaUpload className="mr-2" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        <p>Include columns: firstName, lastName, email, phone, pan</p>
        <p>Max file size: 5MB</p>
      </div>
    </div>
  );
}

export default BulkUpload;
