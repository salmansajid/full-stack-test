import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TreeItem, TreeView } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SharedContext } from '../../../utils/common';

import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavItem from './NavItem';
import {isSuperAdmin } from '../../../utils/common';

const navTreeData = [
  {
    title: 'Administration',
    nodeId: 'administration',
    children: [
      {
        canActivate: isSuperAdmin,
        href: '/administration/user',
        title: 'Manage User'
      },
      {
        canActivate: isSuperAdmin,
        href: '/administration/customer',
        title: 'Manage Customer'
      }
    ]
  }
];

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: '100vw'
  },
  desktopDrawer: {
    width: 256,
    top: 0,
    backgroundColor: theme.palette.secondary.main,
    height: '100vh'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  brand: {
    color: theme.palette.primary.light
  },
  treeNode: {
    color: theme.palette.primary.light,
  },
  treeItem: {
    "&:hover": {
      color: "white"
    }
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const classes = useStyles();
  const location = useLocation();
  const { currentUser } = useContext(SharedContext);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column">
      <Box
        alignItems="start"
        display="flex"
        flexDirection="column"
        p={2}>
        <Typography variant="h2" style={{ fontWeight: "bolder" }} component="div" className={classes.brand} color="primary">Vehicle</Typography>
      </Box>
      <Divider />

      <Box p={2}>

        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >

          {navTreeData.map((treeData, i) => (
            <TreeItem nodeId={treeData.nodeId} key={i} label={treeData.title} className={classes.treeNode}>
              {treeData.children.map((treeItem, j) => (
                treeItem.canActivate(currentUser) ? <NavItem key={j} title={treeItem.title} className={classes.treeItem} href={treeItem.href} /> : ''
              ))}
            </TreeItem>
          ))}
        </TreeView>

      </Box>
      <Divider />

      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark">

      </Box>
    </Box >
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary">
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
