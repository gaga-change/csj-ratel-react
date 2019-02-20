export function depthForEach(arr,resultArr=[]){
  arr.forEach(item=>{
      if(item.children){
        if(item.component){
          resultArr.push({
            path:item.path,
            component:item.component,
          }) 
        }
        depthForEach(item.children,resultArr)
      } else if(item.component){
        resultArr.push({
          path:item.path,
          component:item.component,
        }) 
      }
  })

  return resultArr;
}

