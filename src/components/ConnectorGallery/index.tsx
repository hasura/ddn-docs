import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { Connector, fetchConnectors } from './utils';

export default function Gallery() {
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchConnectors();
        console.log(data);
        data.map((connector: Connector) => {
          // This deals with any "special children" by generating an internal link
          switch (true) {
            case connector.title.includes('PostgreSQL'):
              connector.link = `/connectors/postgresql`;
              break;
            case connector.name.includes('clickhouse'):
              connector.link = `/connectors/clickhouse`;
              break;
            case connector.name.includes('node'):
              connector.link = `/business-logic/typescript`;
              break;
            default:
          }
        });
        setConnectors(data);
      } catch (err) {
        console.log(`Error fetching connectors: ${err}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="vendor-table">
      {connectors.map(connector => (
        <Link href={connector.link ? connector.link : `https://hasura.io/connectors/${connector.name}`}>
          <div className="vendor-card-wrapper">
            <div className="vendor-card">
              <img src={connector.logo} title={connector.title} alt={`Connect ${connector.title} to Hasura DDN`} />
            </div>
            <h5>{connector.title}</h5>
          </div>
        </Link>
      ))}
    </div>
  );
}
