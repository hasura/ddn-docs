import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import './styles.css';
import Icon from '@site/static/icons/event-triggers.svg';
import PostgreSqlLogo from '@site/static/img/databases/logos/postgresql.png';
import MongoDbLogo from '@site/static/img/databases/logos/mongodb.webp';
import TypeScriptLogo from '@site/static/img/databases/logos/ts.png';
import ClickHouseLogo from '@site/static/img/databases/logos/clickhouse-glyph.png';

import PostgreSqlConnect from '@site/docs/getting-started/connect-to-data/_databaseDocs/_postgreSQL/_01-connect-a-source.mdx';
import MongoDBConnect from '@site/docs/getting-started/connect-to-data/_databaseDocs/_mongoDB/_01-connect-a-source.mdx';
import ClickHouseConnect from '@site/docs/getting-started/connect-to-data/_databaseDocs/_clickHouse/_01-connect-a-source.mdx';

import PostgreSqlCreateSourceMetadata from '@site/docs/getting-started/connect-to-data/_databaseDocs/_postgreSQL/_02-create-source-metadata.mdx';
import MongoDBCreateSourceMetadata from '@site/docs/getting-started/connect-to-data/_databaseDocs/_mongoDB/_02-create-source-metadata.mdx';
import ClickHouseCreateSourceMetadata from '@site/docs/getting-started/connect-to-data/_databaseDocs/_clickHouse/_02-create-source-metadata.mdx';

import PostgreSqlAddSourceEntities from '@site/docs/getting-started/connect-to-data/_databaseDocs/_postgreSQL/_03-add-source-entities.mdx';
import MongoDBAddSourceEntities from '@site/docs/getting-started/connect-to-data/_databaseDocs/_mongoDB/_03-add-source-entities.mdx';
import ClickHouseAddSourceEntities from '@site/docs/getting-started/connect-to-data/_databaseDocs/_clickHouse/_03-add-source-entities.mdx';

import PostgreSqlMutate from '@site/docs/getting-started/_databaseDocs/_postgreSQL/_09-mutate-data.mdx';
import MongoDBMutate from '@site/docs/getting-started/_databaseDocs/_mongoDB/_09-mutate-data.mdx';
import ClickHouseMutate from '@site/docs/getting-started/_databaseDocs/_clickHouse/_09-mutate-data.mdx';

import PostgreSqlDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_postgreSQL/_03-deploy-a-connector.mdx';
import MongoDBDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_mongoDB/_03-deploy-a-connector.mdx';
import TypeScriptDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_typeScript/_03-deploy-a-connector.mdx';
import ClickHouseDeploy from '@site/docs/getting-started/deployment/_databaseDocs/_clickHouse/_03-deploy-a-connector.mdx';

const dataSources = {
  PostgreSQL: {
    name: 'PostgreSQL',
    image: PostgreSqlLogo,
  },
  MongoDB: {
    name: 'MongoDB',
    image: MongoDbLogo,
  },
  ClickHouse: {
    name: 'ClickHouse',
    image: ClickHouseLogo,
  },
  TypeScript: {
    name: 'TypeScript',
    image: TypeScriptLogo,
  },
};

const DatabaseContentLoader = () => {
  const location = useLocation();
  const [dbPreference, setDbPreference] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dbParam = params.get('db');
    const savedPreference = localStorage.getItem('hasuraV3DbPreference');
    const isTypeScriptExcluded = location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');

    if (dbParam && dataSources[dbParam]) {
      savePreference(dbParam);
    } else if (savedPreference) {
      // Check if the saved preference is a valid data source
      if (dataSources[savedPreference]) {
        setDbPreference(savedPreference);
      }
      else {
        localStorage.removeItem('hasuraV3DbPreference');
      }
      // If TypeScript is excluded and the saved preference is TypeScript, set preference to null
      // to avoid text at the top of our component
      if (isTypeScriptExcluded && savedPreference === 'TypeScript') {
        setDbPreference(null);
      } else {
        setDbPreference(savedPreference);
      }
    }
  }, [location.search, location.pathname]);

  const savePreference = (preference: string) => {
    localStorage.setItem('hasuraV3DbPreference', preference);

    history.push({
      search: `db=${preference}`,
    });
    setDbPreference(preference);
  };

  const getContent = () => {
    // Split the path into parts, because sometimes we have a trailing slash with our nginx config
    let pathParts = location.pathname.split('/').filter(Boolean);

    // Get the last part of the path, which is the page we want
    let route = pathParts.pop();
    
    switch (route) {
      case 'connect-a-source':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlConnect />;
          case 'MongoDB':
            return <MongoDBConnect />;
          case 'ClickHouse':
            return <ClickHouseConnect />;
          default:
            return <div />;
        }
      case 'create-source-metadata':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlCreateSourceMetadata />;
          case 'MongoDB':
            return <MongoDBCreateSourceMetadata />;
          case 'ClickHouse':
            return <ClickHouseCreateSourceMetadata />;
          default:
            return <div />;
        }
      case 'add-source-entities':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlAddSourceEntities />;
          case 'MongoDB':
            return <MongoDBAddSourceEntities />;
          case 'ClickHouse':
            return <ClickHouseAddSourceEntities />;
          default:
            return <div />;
        }
      case 'mutate-data':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlMutate />;
          case 'MongoDB':
            return <MongoDBMutate />;
          case 'ClickHouse':
            return <ClickHouseMutate />;
          default:
            return <div />;
        }
      case 'deploy-a-connector':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlDeploy />;
          case 'MongoDB':
            return <MongoDBDeploy />;
          case 'ClickHouse':
            return <ClickHouseDeploy />;
          case 'TypeScript':
            return <TypeScriptDeploy />;
          default:
            return <div />;
        }
      default:
        return <div>Content not found...</div>;
    }
  };

  // We'll use this to exclude the TS connector from any of the data connection pages
  const isTypeScriptExcluded = location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');

  return (
    <div>
      <div className="picker-wrapper">
        <small>
          {dbPreference && (!isTypeScriptExcluded || dbPreference !== 'TypeScript')
            ? `You are now reading ${dataSources[dbPreference].name}'s documentation`
            : "Select a data source's documentation"}
        </small>
        <div className="button-wrapper">
          {Object.keys(dataSources).map(key =>
            !isTypeScriptExcluded || key !== 'TypeScript' ? (
              <div
                key={key}
                onClick={() => savePreference(key)}
                className={`data-source ${dbPreference === key ? 'selected' : ''}`}
              >
                {dataSources[key].image ? (
                  <>
                    <img src={dataSources[key].image} alt={dataSources[key].name} />
                    <p>{dataSources[key].name}</p>
                  </>
                ) : (
                  <button>{dataSources[key].name}</button>
                )}
              </div>
            ) : null
          )}
          <Link to="/connectors/overview#supported-sources" className="data-source">
            <Icon />
            <p>Other connectors</p>
          </Link>
        </div>
      </div>
      {dbPreference && (!isTypeScriptExcluded || dbPreference !== 'TypeScript') ? (
        getContent()
      ) : (
        <div>Please select your source preference.</div>
      )}
    </div>
  );
};

export default DatabaseContentLoader;
