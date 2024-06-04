import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import './styles.css';
import PostgreSqlLogo from '@site/static/img/databases/logos/postgresql.png';
import MongoDbLogo from '@site/static/img/databases/logos/mongodb.webp';
import PostgreSqlConnect from '@site/src/_databaseDocs/_postgreSQL/_01-connect-a-data-source.mdx';
import MongoDBConnect from '@site/src/_databaseDocs/_mongoDB/_01-connect-a-data-source.mdx';
import PostgreSqlLink from '@site/src/_databaseDocs/_postgreSQL/_02-link-a-connector.mdx';
import MongoDBLink from '@site/src/_databaseDocs/_mongoDB/_02-link-a-connector.mdx';
import PostgreSqlExposition from '@site/src/_databaseDocs/_postgreSQL/_03-expose-source-entities.mdx';
import MongoDBExposition from '@site/src/_databaseDocs/_mongoDB/_03-expose-source-entities.mdx';
import PostgreSqlMutation from '@site/src/_databaseDocs/_postgreSQL/_09-mutate-data.mdx';
import MongoDBMutation from '@site/src/_databaseDocs/_mongoDB/_09-mutate-data.mdx';

const dataSources = {
  PostgreSQL: {
    name: 'PostgreSQL',
    image: PostgreSqlLogo,
  },
  MongoDB: {
    name: 'MongoDB',
    image: MongoDbLogo,
  },
};

const DatabaseContentLoader = () => {
  const location = useLocation();
  const [dbPreference, setDbPreference] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dbParam = params.get('db');

    if (dbParam && dataSources[dbParam]) {
      savePreference(dbParam);
    } else {
      const savedPreference = localStorage.getItem('dbPreference');
      if (savedPreference) {
        setDbPreference(savedPreference);
      }
    }
  }, [location.search]);

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
          default:
            return <div />;
        }
      case 'link-a-connector':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlLink />;
          case 'MongoDB':
            return <MongoDBLink />;
          default:
            return <div />;
        }
      case 'expose-source-entities':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlExposition />;
          case 'MongoDB':
            return <MongoDBExposition />;
          default:
            return <div />;
        }
      case 'mutate-data':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlMutation />;
          case 'MongoDB':
            return <MongoDBMutation />;
          default:
            return <div />;
        }
      default:
        return <div>Content not found...</div>;
    }
  };

  return (
    <div>
      <div className="picker-wrapper">
        <small>
          {dbPreference
            ? `You are now reading ${dataSources[dbPreference].name}'s documentation`
            : "Select a data source's documentation"}
        </small>
        <div className="button-wrapper">
          {Object.keys(dataSources).map(key => (
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
          ))}
        </div>
      </div>
      {dbPreference ? getContent() : <div>Please select your database preference.</div>}
    </div>
  );
};

export default DatabaseContentLoader;
