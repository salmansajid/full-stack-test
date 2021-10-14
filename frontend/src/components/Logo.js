import { Typography } from '@material-ui/core';

export default function Logo({ variant }) {
  return (
    <Typography variant={variant || 'h3'} style={{ color: "white", fontWeight: "bolder" }} component="div" color="primary">Vehicle</Typography>
  );
};
