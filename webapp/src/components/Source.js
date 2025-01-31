import { useState, useEffect, Fragment } from "react";

import useSources from "stores/sources";
import TableList from "components/TableList";

const SourceItem = ({ source, sourceType, index }) => {
  const [state, setState] = useState({
    isOpen: true,
  });

  if (source.properties["is_system_db"]) {
    return null;
  }
  const handleClickSource = () => {
    setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
    }));
  };

  return (
    <Fragment>
      <div className="relative">
        <div
          className="block p-2 pl-3 border-b cursor-default"
          onClick={handleClickSource}
        >
          {sourceType === "database" ? (
            <span className="text-lg text-gray-600 text-center mr-3">
              <i className="fas fa-database" />
            </span>
          ) : null}
          <span className="font-semibold tracking-wide">{source.label}</span>
          &nbsp;
          <span className="inline-block bg-green-200 text-sm px-2 rounded">
            {source.provider}
          </span>
        </div>
      </div>

      {state.isOpen ? (
        <TableList sourceLabel={source.label} sourceType={sourceType} />
      ) : null}
    </Fragment>
  );
};

const Source = () => {
  const isReady = useSources((state) => state.isReady);
  const sourceRows = useSources((state) => state.rows);
  const fetchSource = useSources((state) => state.fetchSource);
  useEffect(() => {
    fetchSource();
  }, [fetchSource]);
  /* const [state, setState] = useState({
    sourceIndex: null,
  }); */
  // const {sourceIndex} = state;

  if (!isReady) {
    return null;
  }

  return (
    <Fragment>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-yellow-200 text-center mr-3">
          <i className="fas fa-star" />
        </span>
        <span className="font-semibold text-gray-500">Starred</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-orange-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Orders</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-gray-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Customers</span>
      </div>

      {sourceRows
        .filter((x) => x.type === "database")
        .map((source, i) => (
          <SourceItem
            key={`sr-${source.label}`}
            index={i}
            source={source}
            sourceType="database"
          />
        ))}

      {/* <Panel title="Services">
        {sourceList.isReady ? sourceList.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null}
      </Panel> */}
    </Fragment>
  );
};

export default Source;
