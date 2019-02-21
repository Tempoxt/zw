import request from '@/plugins/request'

export function menuInit (type, parameter, catolog) {
  return request.get('/menuinit', {
    params: {
      type,
      parameter,
      catolog
    }
  })
}
export function getTabs(pk){
  return request.get('/menusheet/menutree/' + pk)
}
export function getMenu (position, pk = 0) {
  return request.get('/menusheet/menutree/' + pk, {
    params: {
      position
    }
  })
}
export function getOrg () {
  return request.get('/org')
}

export function resource (url) {
  return {
    get (params) {
      return request.get(`/${url}`, {
        params
      })
    },
    create (data) {
      return request.post(`${url}`, data)
    },
    update (pk, data) {
      return request.put(`/${url}/` + pk, data)
    },
    remove (ids,parmas) {
      return request.delete(`/${url}/bluk`, {
        params: {
          ids,
          ...parmas
        }
      })
    },
    action(action,ids){
      return request.put(`/${url}/bluk`, {
        action
      },{
        params:{
          ids
        },
      })
    },
    find(id,params){
      return request.get(`/${url}/${id}`, {
        params
      })
    },
    getSelect(parmas = {}){
      return request.get(`/${url}/select`, {
        params: parmas
      })
      
    }

  }
}
