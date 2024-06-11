import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import './styles.css';
import Icon from '@site/static/icons/event-triggers.svg';
import PostgreSqlLogo from '@site/static/img/databases/logos/postgresql.png';
import MongoDbLogo from '@site/static/img/databases/logos/mongodb.webp';
import TypeScriptLogo from '@site/static/img/databases/logos/ts.png';
import ClickHouseLogo from '@site/static/img/databases/logos/clickhouse-glyph.png';
import PostgreSqlConnect from '@site/src/_databaseDocs/_postgreSQL/_01-connect-a-data-source.mdx';
import MongoDBConnect from '@site/src/_databaseDocs/_mongoDB/_01-connect-a-data-source.mdx';
import ClickHouseConnect from '@site/src/_databaseDocs/_clickHouse/_01-connect-a-data-source.mdx';
import PostgreSqlLink from '@site/src/_databaseDocs/_postgreSQL/_02-create-source-metadata.mdx';
import MongoDBLink from '@site/src/_databaseDocs/_mongoDB/_02-create-source-metadata.mdx';
import ClickHouseLink from '@site/src/_databaseDocs/_clickHouse/_02-create-source-metadata.mdx';
import PostgreSqlExposition from '@site/src/_databaseDocs/_postgreSQL/_03-add-source-entities.mdx';
import MongoDBExposition from '@site/src/_databaseDocs/_mongoDB/_03-add-source-entities.mdx';
import ClickHouseExposition from '@site/src/_databaseDocs/_clickHouse/_03-add-source-entities.mdx';
import PostgreSqlMutation from '@site/src/_databaseDocs/_postgreSQL/_09-mutate-data.mdx';
import MongoDBMutation from '@site/src/_databaseDocs/_mongoDB/_09-mutate-data.mdx';
import ClickHouseMutation from '@site/src/_databaseDocs/_clickHouse/_09-mutate-data.mdx';
import PostgreSqlDeployment from '@site/src/_databaseDocs/_postgreSQL/_deployment.mdx';
import MongoDBDeployment from '@site/src/_databaseDocs/_mongoDB/_deployment.mdx';
import TypeScriptDeployment from '@site/src/_databaseDocs/_typeScript/_deployment.mdx';
import ClickHouseDeployment from '@site/src/_databaseDocs/_clickHouse/_deployment.mdx';

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dbParam = params.get('db');
    const savedPreference = localStorage.getItem('dbPreference');
    const isTypeScriptExcluded = location.pathname.includes('connect-to-data');

    if (dbParam && dataSources[dbParam]) {
      savePreference(dbParam);
    } else if (savedPreference) {
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
    localStorage.setItem('dbPreference', preference);
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
            return <PostgreSqlLink />;
          case 'MongoDB':
            return <MongoDBLink />;
          case 'ClickHouse':
            return <ClickHouseLink />;
          default:
            return <div />;
        }
      case 'add-source-entities':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlExposition />;
          case 'MongoDB':
            return <MongoDBExposition />;
          case 'ClickHouse':
            return <ClickHouseExposition />;
          default:
            return <div />;
        }
      case 'mutate-data':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlMutation />;
          case 'MongoDB':
            return <MongoDBMutation />;
          case 'ClickHouse':
            return <ClickHouseMutation />;
          default:
            return <div />;
        }
      case 'deploy-a-connector':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlDeployment />;
          case 'MongoDB':
            return <MongoDBDeployment />;
          case 'ClickHouse':
            return <ClickHouseDeployment />;
          case 'TypeScript':
            return <TypeScriptDeployment />;
          default:
            return <div />;
        }
      default:
        return <div>Content not found...</div>;
    }
  };

  // We'll use this to exclude the TS connector from any of the data connection pages
  const isTypeScriptExcluded = location.pathname.includes('connect-to-data');

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
