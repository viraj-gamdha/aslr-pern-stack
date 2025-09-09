"use client";

import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/components/ui/toast";
import { useUploadFileMutation } from "@/redux/apis/uploadApiSlice";
import { parseError } from "@/utils/helpers";
import React, { useState } from "react";

const FileUpload: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadFile, { isLoading, data, error }] = useUploadFileMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFile({ projectId, data: formData }).unwrap();
      successToast("Success");
    } catch (err) {
      console.error("Upload failed:", err);
      errorToast(parseError(err));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload File</h2>
      <input type="file" onChange={handleChange} />
      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={isLoading || !file}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </Button>

      {data && (
        <div style={{ marginTop: "1rem" }}>
          ✅ Uploaded Key: <strong>{data.data}</strong>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
