import React from "react"
import { Tabs, TabsItem, TableChart } from "nr1"
import Heatmap from '../components/heat-map'

import getQuery from "./get-query";

// TODO make this smarter over time. Round to significant digits or something. 
function smartFormat(value) {
  return value == Math.round(value) ? value : value.toFixed(3)
}

export default class FacetTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      limit: "1000"
    }
  }

  render() {
    const { account, setFilter, attribute, dimension } = this.props
    if (!attribute || !dimension) return <div />

    const query = getQuery(this.props, this.state)
    const onClickRow = (key, row) => {
      const value = row[key]

      setFilter(key, value)
    }

    const formatLabel=({name, value}) => `${name}: ${smartFormat(value)}`

    /* FIXME! @danielgolden I am having trouble with vertical sizing
     * now that the table is enclosed in tabs. */
    return <div>
      <Tabs defaultValue="table">
        <TabsItem value="table" label="Table">
          <div style={{ height: "800px" }}>
            <TableChart className="primary-table"
              accountId={account.id} query={query}
              onClickTable={onClickRow} />
          </div>
        </TabsItem>
        <TabsItem value="heatmap" label="Heat Map" className="primary-heat-map">
          <Heatmap accountId={account.id} query={query}
            formatLabel={formatLabel} showLegend
            max={(max) => Math.ceil(max)}
            onSelect={(value) => setFilter(dimension, value)} />
        </TabsItem>
      </Tabs>
    </div>

  }
}