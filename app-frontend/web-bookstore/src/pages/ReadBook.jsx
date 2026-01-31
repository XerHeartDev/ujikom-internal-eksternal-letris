import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function ReadBook() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const fetchBookFile = async () => {
      try {
        const res = await api.get(`/books/${id}/read`);

        const blob = new Blob([res.data], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);

        setFileUrl(url);
      } catch (err) {
        setError(err.response.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookFile();

    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [id, fileUrl]);

  if (loading) return <p className="p-4">Loading book...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-screen">
      <iframe src={fileUrl} title="Book Reader" className="w-full h-full" />
    </div>
  );
}
