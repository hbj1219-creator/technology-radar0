import CompanyName from './company-name';
export default function CompanyTags({companies}:{companies:readonly string[]}){
 return <span className="company-tags" aria-label="기업">{[...new Set(companies)].map(company=><span key={company} className="headline-company"><CompanyName name={company}/></span>)}</span>;
}
