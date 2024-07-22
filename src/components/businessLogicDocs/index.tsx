import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import './styles.css';
import TypeScriptLogo from '@site/static/img/databases/logos/ts.png';
import PythonLogo from '@site/static/img/databases/logos/python.png';

import TypeScriptBusinessLogic from '@site/docs/getting-started/build/_databaseDocs/_typescript/_06-add-business-logic.mdx';

const dataConnectors = {
  TypeScript: {
    name: 'TypeScript',
    image: TypeScriptLogo,
  },
  Python: {
    name: 'Python',
    image: PythonLogo,
  },
};

export const ConnectorContentLoader = () => {
  const location = useLocation();
  const [connectorPreference, setConnectorPreference] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connectorParam = params.get('preferredLanguage');
    const savedPreference = localStorage.getItem('hasuraV3connectorLanguagePreference');
    const isTypeScriptExcluded =
      location.pathname.includes('connect-to-data') || location.pathname.includes('mutate-data');

    if (connectorParam && dataConnectors[connectorParam]) {
      savePreference(connectorParam);
    } else if (savedPreference) {
      // Check if the saved preference is a valid data source
      if (dataConnectors[savedPreference]) {
        setConnectorPreference(savedPreference);
      } else {
        localStorage.removeItem('hasuraV3connectorLanguagePreference');
      }
      // If TypeScript is excluded and the saved preference is TypeScript, set preference to null
      // to avoid text at the top of our component
      if (isTypeScriptExcluded && savedPreference === 'TypeScript') {
        setConnectorPreference(null);
      } else {
        setConnectorPreference(savedPreference);
      }
    }
  }, [location.search, location.pathname]);

  const savePreference = (preference: string) => {
    localStorage.setItem('hasuraV3DbPreference', preference);

    history.push({
      search: `perferredLanguage=${preference}`,
    });

    setConnectorPreference(preference);
  };

  const getContent = () => {
    // Split the path into parts, because sometimes we have a trailing slash with our nginx config
    let pathParts = location.pathname.split('/').filter(Boolean);

    // Get the last part of the path, which is the page we want
    let route = pathParts.pop();

    switch (route) {
      case 'add-business-logic':
        switch (connectorPreference) {
          case 'TypeScript':
            return <TypeScriptBusinessLogic />;
          case 'Python':
            return <TypeScriptBusinessLogic />;
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
          {connectorPreference
            ? `You are now reading ${dataConnectors[connectorPreference].name}'s documentation`
            : "Select a connector's documentation"}
        </small>
        <div className="button-wrapper">
          {Object.keys(dataConnectors).map(key => (
            <div
              key={key}
              onClick={() => savePreference(key)}
              className={`data-source ${connectorPreference === key ? 'selected' : ''}`}
            >
              {dataConnectors[key].image ? (
                <>
                  <img src={dataConnectors[key].image} alt={dataConnectors[key].name} />
                  <p>{dataConnectors[key].name}</p>
                </>
              ) : (
                <button>{dataConnectors[key].name}</button>
              )}
            </div>
          ))}
        </div>
      </div>
      {connectorPreference ? getContent() : <div>Please select your source preference.</div>}
    </div>
  );
};

