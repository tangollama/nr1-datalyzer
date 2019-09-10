import React from "react"
import {Tabs, TabsItem, TableChart} from "nr1"
import Heatmap from '../components/heat-map'

import getQuery  from "./get-query";

export default class FacetTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      limit: "1000"
    }
  }

  render() {
    const {account, setFilter, attribute, dimension} = this.props
    if(!attribute || !dimension) return <div/>
    
    const query = getQuery(this.props, this.state)
    const onClickRow = (key, row) => {      
      const value = row[key]

      setFilter(key, value)
    }

    console.log(query)
    return <div>
      <Tabs>
      <TabsItem itemKey="table" label="Table">
        <div style={{height: "800px"}}>
          <TableChart className="primary-table" 
              accountId={account.id} query={query} 
              onClickTable={onClickRow} />
        </div>
      </TabsItem>
      <TabsItem itemKey="heatmap" label="Heat Map">
        <Heatmap accountId={account.id} query={query} 
          onSelect={(value) => setFilter(dimension, value)}/>
      </TabsItem>
    </Tabs>
      </div>
    
  }
}