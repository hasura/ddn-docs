import React from 'react';
import { useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import Icon from '@site/static/icons/event-triggers.svg';
import './styles.css';
import { dataSources } from './dataSources';
import { isBusinessLogicConnector, savePreference } from './utils';

interface SelectorProps {
  connectorPreference: string | null;
  setConnectorPreference: (preference: string) => void;
  isBusinessLogicExcluded: boolean;
  isAddBusinessLogicPage: boolean;
  history: ReturnType<typeof useHistory>;
}

export const Selector: React.FC<SelectorProps> = ({
  connectorPreference,
  setConnectorPreference,
  isBusinessLogicExcluded,
  isAddBusinessLogicPage,
}) => {
  const history = useHistory();

  return (
    <div className="picker-wrapper">
      <small>
        {connectorPreference && (!isBusinessLogicExcluded || !isBusinessLogicConnector(connectorPreference))
          ? `You are now reading ${dataSources[connectorPreference].name}'s documentation`
          : "Select a data source's documentation"}
      </small>
      <div className="button-wrapper">
        {Object.keys(dataSources).map(key =>
          isAddBusinessLogicPage ? (
            isBusinessLogicConnector(key) && (
              <div
                key={key}
                onClick={() => setConnectorPreference(savePreference(key, history))}
                className={`data-source ${connectorPreference === key ? 'selected' : ''}`}
              >
                <div className="image-container">
                  <img src={dataSources[key].image} alt={dataSources[key].name} />
                </div>
                <p>{dataSources[key].name}</p>
              </div>
            )
          ) : !isBusinessLogicExcluded || !isBusinessLogicConnector(key) ? (
            <div
              key={key}
              onClick={() => setConnectorPreference(savePreference(key, history))}
              className={`data-source ${connectorPreference === key ? 'selected' : ''}`}
            >
              <div className="image-container">
                <img src={dataSources[key].image} alt={dataSources[key].name} />
              </div>
              <p>{dataSources[key].name}</p>
            </div>
          ) : null
        )}
        <Link to="/connectors/overview#supported-sources" className="data-source">
          <div className="image-container">
            <Icon />
          </div>
          <p>Other connectors</p>
        </Link>
      </div>
    </div>
  );
};
