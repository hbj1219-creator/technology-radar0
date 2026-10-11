import marks from '../data/company-marks.json';

const companyMarks=marks as Record<string,{path:string}>;
export default function CompanyName({name}:{name:string}){
 const parts=/연구팀/.test(name)?[name]:name.split(/\s*·\s*/);
 return <span className="company-name">{parts.map((part,index)=><span key={index}>{index>0&&' · '}<span className="company-name-part">{companyMarks[part]&&<img className="company-mark" src={companyMarks[part].path} alt="" aria-hidden="true" width={16} height={16} loading="lazy" decoding="async"/>}<span>{part}</span></span></span>)}</span>;
}
