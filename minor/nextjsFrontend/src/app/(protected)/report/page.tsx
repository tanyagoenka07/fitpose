"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const ReportPage = () => {
  const { userId } = useAuth(); // Get logged-in user info
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchReports = async () => {
      try {
        const res = await axios.get(`/api/reports?userId=${userId}`);
        setReports(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Reports</h1>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {error && <p className="text-red-500">Failed to load reports.</p>}

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{report.description}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Date: {new Date(report.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && <p>No reports available.</p>
      )}
    </div>
  );
};

export default ReportPage;
