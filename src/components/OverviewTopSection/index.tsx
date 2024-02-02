import Link from '@docusaurus/Link';
import React from 'react';

interface Props {
  youtubeVideoId: string;
  links: { title: string; href: string }[];
  intro: React.JSX.Element;
}

export const OverviewTopSection = (props: Props) => {
  return (
    <div className={'front-matter'}>
      <div>
        <div>
          {props.intro}
        </div>
        <h4>Quick Links</h4>
        <ul>
          {props.links.map((link, index) => (
            <li key={index}>
              <Link to={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={'video-wrapper'}>
        <div className={'video-aspect-ratio'}>
        <iframe
            src={`https://www.youtube.com/embed/${props.youtubeVideoId}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}