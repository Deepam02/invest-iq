import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Alert, Link } from '@mui/material';
import useStockDetails from '../hooks/useStockDetails';

const CompanyOverview = ({ symbol, exchange }) => {
  const { details, loading, error } = useStockDetails(symbol, exchange);

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!details) return null;

  const { assetProfile } = details;
  if (!assetProfile) {
    return <Alert severity="info" sx={{ mt: 2 }}>No company details available.</Alert>;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Company Overview</Typography>
        <Typography variant="body1">
          <strong>Sector:</strong> {assetProfile.sector || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Industry:</strong> {assetProfile.industry || "N/A"}
        </Typography>
        {assetProfile.website && (
          <Typography variant="body1">
            <strong>Website:</strong>{' '}
            <Link href={assetProfile.website} target="_blank" rel="noopener">
              {assetProfile.website}
            </Link>
          </Typography>
        )}
        {assetProfile.longBusinessSummary && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {assetProfile.longBusinessSummary}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyOverview;
