import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import TableToolbar from './TableToolbar';
import DataCreate from './DataCreate';
import DataEdit from './DataEdit';
import DataDelete from './DataDelete';
import { createSearchParams } from 'react-router-dom';

function DataRowItem({
  id,
  selected = false,
  onClick,
  getDataSelector,
  columns,
}) {
  const { data, error, loading } = useSelector(getDataSelector(id));
  return data ? (
    <TableRow
      key={id}
      id={id}
      hover
      role="checkbox"
      aria-checked={selected}
      selected={selected}
      tabIndex={-1}
      onClick={onClick}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selected}
          inputProps={{
            'aria-labelledby': id,
          }}
        />
      </TableCell>

      {columns.map(({ field, align, render }, i) => {
        const item = data[field] || '';
        return (
          <TableCell key={`cell-${field}-${i}`} align={align}>
            {render ? render(item, data) : item}
          </TableCell>
        );
      })}
    </TableRow>
  ) : null;
}

function TableSubHeader({ children }) {
  return (
    <TableRow>
      <TableCell colSpan="100%">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{children}</Box>
      </TableCell>
    </TableRow>
  );
}

export default function DataList({
  title,
  path,
  paginationSelector,
  getDataSelector,
  fetchPaginationAction,
  deleteAction,
  updateAction,
  createAction,
  columns,
  formConfigs,
  createFormTitle,
  createFormDescription,
  editFormTitle,
  editFormDescription,
  validateEditCandidate,
  deleteFormTitle,
  deleteFormDescription,
  validateDeleteCandidates,
  customActions = [],
  customRoutes = [],
}) {
  const {
    idList,
    page,
    limit,
    total = 0,
    error,
    loading,
  } = useSelector(paginationSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState({});

  const fetchPaginate = useCallback(
    async (options) => {
      try {
        await dispatch(fetchPaginationAction(options));
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, fetchPaginationAction]
  );

  useEffect(() => {
    fetchPaginate({ page: 0 });
  }, [fetchPaginate]);

  async function handleChangePage(_, newPage) {
    await fetchPaginate({ page: newPage });
    setSelectedState({});
  }

  async function handleChangeLimit(e) {
    const newLimit = parseInt(e.target.value, 10);
    await fetchPaginate({ page: 0, limit: newLimit });
  }

  function handleSelectItem(id) {
    setSelectedState({
      ...selectedState,
      [id]: !selectedState[id],
    });
  }

  function handleSelectAll(e) {
    if (numSelected === limit) {
      setSelectedState({});
    } else {
      setSelectedState(
        idList.reduce((result, id) => {
          result[id] = true;
          return result;
        }, {})
      );
    }
  }

  const selectedList = Object.entries(selectedState).reduce(
    (result, [id, selected]) => {
      if (selected) result.push(id);
      return result;
    },
    []
  );

  function handleDelete() {
    navigate({
      pathname: `${path}/delete`,
      search: `?${createSearchParams({
        selected: selectedList,
      })}`,
    });
  }

  function handleEdit() {
    navigate(`${path}/${selectedList[0]}/edit`);
  }

  function handleAdd() {
    navigate(`${path}/create`);
  }

  const numSelected = selectedList.length;
  const maxSelected = Math.min(idList.length, limit);
  return (
    <Container>
      <Typography variant="h6" component="h1" p={2}>
        {title}
      </Typography>
      <TableToolbar
        selectedList={selectedList}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        customActions={customActions}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="data-table" role="group">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < maxSelected}
                  checked={total > 0 && numSelected === maxSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map(({ field, label = field, align }) => (
                <TableCell key={`header_cell-${field}`} align={align}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
            {loading && (
              <TableSubHeader>
                <CircularProgress />
              </TableSubHeader>
            )}
            {error && (
              <TableSubHeader>
                <Typography color="error">
                  {error?.message || 'Error fetching table data'}
                </Typography>
              </TableSubHeader>
            )}
          </TableHead>
          <TableBody>
            {idList.map((id) => (
              <DataRowItem
                key={`data_row-${id}`}
                id={id}
                selected={selectedState[id]}
                onClick={() => handleSelectItem(id)}
                getDataSelector={getDataSelector}
                columns={columns}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[1, 5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeLimit}
      />

      <Routes>
        {customRoutes.map((customRouteProps) => (
          <Route
            key={`custom_route-${customRouteProps.path}`}
            {...customRouteProps}
          />
        ))}
        <Route
          path="/create"
          element={
            <DataCreate
              createAction={createAction}
              fetchPaginationAction={fetchPaginationAction}
              getDataSelector={getDataSelector}
              formConfigs={formConfigs}
              title={createFormTitle}
              description={createFormDescription}
            />
          }
        />
        <Route
          path="/delete"
          element={
            <DataDelete
              deleteAction={deleteAction}
              fetchPaginationAction={fetchPaginationAction}
              title={deleteFormTitle}
              description={deleteFormDescription}
              validateDeleteCandidates={validateDeleteCandidates}
            />
          }
        />
        <Route
          path="/:id/edit"
          element={
            <DataEdit
              getDataSelector={getDataSelector}
              updateAction={updateAction}
              formConfigs={formConfigs}
              title={editFormTitle}
              description={editFormDescription}
              validateEditCandidate={validateEditCandidate}
            />
          }
        />
      </Routes>
    </Container>
  );
}
