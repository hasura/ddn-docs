import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import PostgreSqlConnect from '@site/src/_databaseDocs/_postgreSQL/_01-connect-a-data-source.mdx';
import PostgreSqlLink from '@site/src/_databaseDocs/_postgreSQL/_02-link-a-connector.mdx';

const DatabaseContentLoader = () => {
  const location = useLocation();
  const [dbPreference, setDbPreference] = useState(null);

  useEffect(() => {
    const savedPreference = localStorage.getItem('dbPreference');
    if (savedPreference) {
      setDbPreference(savedPreference);
    }
  }, []);

  const savePreference = preference => {
    localStorage.setItem('dbPreference', preference);
    setDbPreference(preference);
  };

  const getContent = () => {
    const route = location.pathname.split('/').pop();
    console.log(route);
    switch (route) {
      case 'connect-a-source':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlConnect />;
          default:
            return <div>Content not found...</div>;
        }
      case '02-create-a-data-link':
        switch (dbPreference) {
          case 'PostgreSQL':
            return <PostgreSqlLink />;
          default:
            return <div>Content not found...</div>;
        }
      default:
        return <div>Content not found...</div>;
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => savePreference('PostgreSQL')}>PostgreSQL</button>
      </div>
      {dbPreference ? getContent() : <div>Please select your database preference.</div>}
    </div>
  );
};

export default DatabaseContentLoader;
