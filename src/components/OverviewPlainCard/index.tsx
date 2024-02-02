import ChevronRight from '@site/static/icons/chevron-right.svg';
import Link from '@docusaurus/Link';
export const OverviewPlainCard = (props: { title: string; body: string; link: string }) => {
  return (
    <div className={'card'}>
      <div className={'card-content-items'}>
        <div className={'card-content'}>
          <h4>
            {props.title}
          </h4>
          <p>{props.body}</p>
        </div>
      </div>
      <Link href={props.link}>Connectors <ChevronRight /></Link>
    </div>
  )
}
