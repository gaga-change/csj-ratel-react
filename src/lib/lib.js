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

export function deepExistMenu(menu,deepExist){
    let arr =[], index = 0;
    if(!Array.isArray(menu)){
        return arr
    }
    for(let i = 0;i<deepExist.length;i++){
        for(let j=0;j<menu.length;j++){
                if(deepExist[i].must){
                  arr[index] = deepExist[i];
                  index++;
                  break;
                } else if(deepExist[i].path === menu[j].path){
                    arr[index] = deepExist[i]
                    if(deepExist[i].children&&deepExist[i].children.length>0){
                        arr[index].children = deepExistMenu(menu[j].children,deepExist[i].children)
                    } else{
                      arr[index].children=[]
                    }
                    index++
                }
                
            }
    }
    return arr
}

