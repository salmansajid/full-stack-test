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
  TableRow,
  Typography
} from '@material-ui/core';

import axios from 'axios';
import { getURL, dateFormat, dateToPickerFormat } from '../../../utils/common';
import { Pagination } from '@material-ui/lab';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';

import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";



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


export default function CoordinatesView() {

  const { state } = useLocation();
  const classes = useStyles();
  const columns = [{
    id: 'latitude',
    label: 'Latitude',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'longitude',
    label: 'Longitude',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'createdAt',
    label: 'Recorded Date',
    minWidth: 'auto',
    className: '',
    format: (value) => `${dateFormat(value)}`
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [coordinates, setCoordinates] = useState([]);
  const [vehicle, setVehicle] = useState(state);
  const [fromselectedDate, fromhandleDateChange] = useState(new Date());
  const [toselectedDate, tohandleDateChange] = useState(new Date());

  const _getCoordinates = (page, vehicleId) => {
    axios.get(getURL('/coordinates'), { params: { page, vehicleId: vehicleId } })
      .then(res => {
        setPageCount(res.data.pages)
        setCoordinates(res.data.data)
      });
  }

  const getCoordinates = useCallback(debounce((page, vehicleId) => {
    _getCoordinates(page, vehicleId);
  }, 300), []);

  const submit = () => {
    let start_date = fromselectedDate._d;
    let end_date = toselectedDate._d;
    let id = vehicle.vehicleId.id
    axios.get(getURL('/coordinates'), { params: { page, vehicleId: id, start_date: start_date, end_date: end_date } })
      .then(res => {
        setPageCount(res.data.pages)
        setCoordinates(res.data.data)
      });
  }


  useEffect(() => {
    getCoordinates(page, vehicle.vehicleId.id);
  }, [page, vehicle.vehicleId.id]);





  return (
    <Paper className={classes.root}>

      <TableContainer className={classes.container}>
        <Grid container direction="row">
          <Grid item sm={6}>
            <Typography variant="h4" component="div" color="primary">
              <RouterLink to="/administration/vehicle">
                <ArrowBackIcon key="back" style={{fontSize: '28px', paddingTop:"1%"}} />
              </RouterLink>
              {vehicle.vehicleId.num}</Typography>
          </Grid>
          <Grid item sm={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                style={{ marginLeft: "20%" }}
                label="From Date"
                format="DD/MM/YYYY"
                inputVariant="outlined"
                value={fromselectedDate}
                onChange={fromhandleDateChange}>

              </DatePicker>
            </MuiPickersUtilsProvider>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                style={{ marginLeft: "10%" }}
                label="To Date"
                inputVariant="outlined"
                value={toselectedDate}
                format="DD/MM/YYYY"
                onChange={tohandleDateChange}
              ></DatePicker>
            </MuiPickersUtilsProvider>
            <Button key="edit"
              style={{ marginLeft: "5%" }}
              variant="contained"
              color="primary"
              onClick={() => submit()}>
              Submit</Button>

          </Grid>
        </Grid>

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
            {coordinates.map((coordinate) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={coordinate.id}>
                  {columns.map((column) => {
                    const value = coordinate[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, coordinate) : value}
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
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
