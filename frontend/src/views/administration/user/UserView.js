import { useEffect, useState, useCallback } from 'react';
import {
  makeStyles,
  Grid,
  Paper,
  InputBase,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import TableHeader from '../../TableHeader';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import AddUserView from './AddUserView';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import { debounce } from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: '20px'
  },
  container: {
    // maxHeight: 450,
    padding: 20,

  },
  pagination: {
    border: 'none',
    display: 'block',
    alignItems: 'right'
  },
  active: {
    color: theme.palette.success.main
  },
  searchInput: {
    border: '1px solid grey',
    borderRadius: 4,
    opacity: 0.6,
    padding: '0px 8px',
    marginRight: 7,
    height: 30,
  },
}));

function AlertMessage(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

export default function UserView() {
  const classes = useStyles();
  const columns = [{
    id: 'firstName',
    label: 'First Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'lastName',
    label: 'Last Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'Role.name',
    label: 'Role',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Role.name
  }, {
    id: 'username',
    label: 'Username',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'email',
    label: 'Email',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'phone',
    label: 'Phone',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'isActive',
    label: 'Status',
    minWidth: 'auto',
    className: value => value ? classes.active : '',
    format: value => value ? 'Active' : 'In-Active',
  }, {
    id: 'actions',
    label: '',
    minWidth: 'auto',
    className: '',
    format: (value, entity) =>
      [
        <EditIcon key="edit" onClick={() => openEditView(entity)} />,
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [formErrors, setFormErrors] = useState('');
  const [addUserViewOpen, setAddUserViewOpen] = useState(false);
  const [deleteUserViewOpen, setDeleteUserViewOpen] = useState(false);

  const addUser = data => {
    let apiPromise = null;
    setFormErrors('');
    if (!selectedUser) apiPromise = axios.post(getURL('/user'), data);
    else apiPromise = axios.put(getURL(`/user/${selectedUser.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      closeAddUserView();
      getUsers();
    });
  };

  const deleteUser = data => {
    axios.delete(getURL(`/user/${selectedUser.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteUserView();
        getUsers();
      });
  };

  const openEditView = user => {
    setSelectedUser(user);
    setAddUserViewOpen(true);
  }

  const openDeleteView = user => {
    setSelectedUser(user);
    setDeleteUserViewOpen(true);
  }

  const closeAddUserView = () => {
    setSelectedUser(null);
    setAddUserViewOpen(false);
  }

  const closeDeleteUserView = () => {
    setSelectedUser(null);
    setDeleteUserViewOpen(false);
  }

  const _getUsers = (page, searchKeyword) => {
    axios.get(getURL('/user'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setUsers(res.data.data)
      });
  };

  const getUsers = useCallback(debounce((page, searchKeyword) => {
    _getUsers(page, searchKeyword);
  }, 300), []);

  const getRelations = () => {
    axios.get(getURL('/user/relations'))
      .then(res => setRoles(res.data.roles));
  };

  useEffect(() => {
    getUsers(page, searchKeyword);
  }, [page, searchKeyword]);

  useEffect(() => {
    getRelations();
  }, []);

  const searchInput = <InputBase
    placeholder="Search"
    className={classes.searchInput}
    id="search"
    label="Search"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;
  const addUserButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddUserViewOpen(true)}>ADD USER</Button>;
  const addUserModal = <AddUserView
    key={3}
    formErrors={formErrors}
    roles={roles}
    selectedUser={selectedUser}
    open={addUserViewOpen}
    addUser={addUser}
    handleClose={() => closeAddUserView()} />
 
  const headerButtons = [searchInput, addUserButton, addUserModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage User" buttons={headerButtons} />
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
            {users.map((user) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                  {columns.map((column) => {
                    const value = user[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, user) : value}
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
            onChange={(e, newPage) => setPage(newPage)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}