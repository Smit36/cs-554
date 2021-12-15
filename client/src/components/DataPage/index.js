import React, { useEffect, useState } from 'react';
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

import TableToolbar from './TableToolbar';
import DataCreate from './DataCreate';
import DataEdit from './DataEdit';

function DataRowItem({ id, selected = false, onClick, getDataSelector, columns }) {
  const { data, error, loading } = useSelector(getDataSelector(id));
  return data ? (
    <TableRow
      key={id}
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
          <TableCell key={`cell-${field}-${i}`} align={align}>{render ? render(item, data) : item}</TableCell>
        );
      })}
    </TableRow>
  ) : null;
}

export default function DataList({
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
  editFormTitle,
  createFormDescription,
  editFormDescription,
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

  useEffect(() => {
    dispatch(fetchPaginationAction({ page: 0 }));
  }, [dispatch, fetchPaginationAction]);

  function handleChangePage(_, newPage) {
    dispatch(fetchPaginationAction({ page: newPage }));
    setSelectedState({});
  }

  function handleChangeLimit(e) {
    const newLimit = parseInt(e.target.value, 10);
    dispatch(fetchPaginationAction({ page: 0, limit: newLimit }));
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
      // setNumSelected(0);
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

  async function handleDelete() {
    await Promise.all([
      ...selectedList.map((id) => dispatch(deleteAction(id))),
    ]);
    setSelectedState({});
    dispatch(fetchPaginationAction({ page: 0 }));
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
    <>
      <TableToolbar
        selectedList={selectedList}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        customActions={customActions}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < maxSelected}
                  checked={total > 0 && numSelected === maxSelected}
                  onChange={handleSelectAll}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
              {columns.map(({ field, label = field, align }) => (
                <TableCell key={`header_cell-${field}`} align={align}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
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
              formConfigs={formConfigs}
              title={createFormTitle}
              description={createFormDescription}
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
            />
          }
        />
      </Routes>
    </>
  );
}
