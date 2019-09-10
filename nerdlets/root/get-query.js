import quote from '../lib/quote-attribute';


export function getFilterWhere(props, filters) {
  const clauses = Object.keys(filters).
    map(attr => {
      const values = filters[attr]
      if (values.length == 1) {
        return `${quote(attr)} = '${values[0]}'`
      }
      else {
        return `${quote(attr)} IN (${values.map(v => `'${v}'`).join(',')})`
      }
    })

  const domain = props.entity && props.entity.domain
  if(domain == 'INFRA') {
    clauses.push(`entityGuid = '${props.entity.guid}'`)
  }
  // FIXME for some reason mobile events no longer sending in app id
  else if(domain == 'MOBILE') {
    clauses.push(`appName = '${props.entity.name}'`)
  }
  else if(domain) {
    clauses.push(`appId = ${props.entity.applicationId}`)
  }
  if (clauses.length > 0) {
    return clauses.join(" AND ")
  }
  else {
    return null
  }
}

export function timePickerNrql(props) {
  const {timeRange} = props.launcherUrlState
  if(timeRange.beginTime && timeRange.endTime) {
    return `SINCE ${timeRange.beginTime} UNTIL ${timeRange.endTime}`    
  }
  else {
    return `SINCE ${timeRange.duration / 60000} MINUTES AGO`
  }
}

export default function getQuery(props, state) {
  const { dimension, fn, attribute, filters, eventType } = props;
  const { timeseries, limit } = state || {};
  const where = getFilterWhere(props, filters)

  // special case for  when the user selects "Count(*)" as the attribute to be plotted
  const select = attribute ==  "__count__" ? 'count(*)' : `${fn}(${quote(attribute)})`

  let query = `SELECT ${select} FROM ${eventType} ${timePickerNrql(props)}`;

  if (dimension) query = query.concat(` FACET ${quote(dimension)}`);
  if (limit) query = query.concat(` LIMIT ${limit}`);
  if (where) query = query.concat(` WHERE ${where}`);
  if (timeseries) query = query.concat(` TIMESERIES`);

  return query;
}
