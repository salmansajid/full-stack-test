import { useCallback, useEffect, useState } from 'react';
import {
  makeStyles,
  Paper,
  Grid,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { Pagination } from '@material-ui/lab';
import {debounce} from 'lodash';
import {useNavigate} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: '20px'
  },
  container: {
    padding: 20,
  },
  active: {
    color: theme.palette.success.main
  }
}));


export default function VehicleView() {
  const navigate = useNavigate();
  const classes = useStyles();
  const columns = [{
    id: 'num',
    label: 'Vehicle ID',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'actions',
    label: '',
    minWidth: 'auto',
    className: '',
    format: (value, entity) =>
      [
        <Button key="edit"
        style={{float: "right"}}  
        variant="contained"
        color="primary"
        onClick={() => getcoordinate(entity)}
        > 
        Timeline</Button>,
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [vehicles, setVehicles] = useState([]);

  

  const _getVehicles = (page) => {
    axios.get(getURL('/vehicle'), { params: { page} })
      .then(res => {
        setPageCount(res.data.pages)
        setVehicles(res.data.data)
      });
  }

  const getVehicles = useCallback(debounce((page) => {
    _getVehicles(page);
  }, 300), []);


  const getcoordinate = vehicle => {
    navigate('/administration/coordinates', {
      state: {
        vehicleId:  vehicle
      }
    })
  }


  useEffect(() => {
    getVehicles(page);
  }, [page]);

  useEffect(() => {
  }, []);

 

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={vehicle.id}>
                  {columns.map((column) => {
                    const value = vehicle[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, vehicle) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justify="space-between">
        <Grid item></Grid>
        <Grid item>
          <Pagination
            component="div"
            shape="rounded"
            count={pageCount}
            color="primary"
            page={page}
            className={classes.pagination}
            onChange={(e, page) => setPage(page)}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
