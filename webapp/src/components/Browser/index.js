import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData, toggleRowSelection } from "services/browser/actions";
import { fetchSchema } from "services/schema/actions";
import rowRenderer from "./rowRenderer";
import TableHead from "./TableHead";


const Browser = ({
  isReady, sourceId, tableName, tableColumns, tableRows, schemaColumns, history,
  querySpecificationColumns, selectedRowList, fetchData, fetchSchema, toggleRowSelection
}) => {
  useEffect(() => {
    fetchSchema(sourceId);
    fetchData();
  }, [sourceId, tableName, fetchSchema, fetchData]);
  if (!isReady) {
    return (
      <div>Loading...</div>
    );
  }

  const rowRendererList = rowRenderer(schemaColumns, tableColumns, querySpecificationColumns);
  const RowSelectorCell = ({row}) => {
    const handleRowSelect = event => {
      event.preventDefault();
      event.stopPropagation();
      toggleRowSelection(row[0]);
    }

    const stopPropagation = event => {
      event.stopPropagation();
    }

    return (
      <td onClick={handleRowSelect}>
        <input className="checkbox" type="checkbox" onClick={stopPropagation} onChange={handleRowSelect} checked={selectedRowList.includes(row[0])} />
      </td>
    );
  }

  const Row = ({row, index}) => {
    const handleRowClick = event => {
      event.preventDefault();
      history.push(`/browse/${sourceId}/${tableName}/${row[0]}`);
    }

    return (
      <tr onClick={handleRowClick}>
        <RowSelectorCell row={row} />
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? <Cell key={`td-${index}-${j}`} data={cell} /> : null;
        })}
      </tr>
    );
  }

  return (
    <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
      <thead>
        <TableHead />
      </thead>

      <tbody>
        {tableRows.map((row, i) => (
          <Row key={`tr-${i}`} row={row} index={i} />
        ))}
      </tbody>
    </table>
  );
}


const mapStateToProps = (state, props) => {
  let {sourceId, tableName} = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;

  // We are ready only when all the needed data is there
  if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
    state.browser.isReady && state.browser._cacheKey === _browserCacheKey &&
    state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
      tableColumns: state.browser.columns,
      tableRows: state.browser.rows,
      selectedRowList: state.browser.selectedRowList,
      querySpecificationColumns: state.querySpecification.columnsSelected,
    }
  } else {
    return {
      isReady,
      sourceId,
      tableName,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    fetchData,
    fetchSchema,
    toggleRowSelection,
  }
)(Browser));