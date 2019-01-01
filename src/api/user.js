import request from '@/plugins/request'
export function partuser (org_id) {
  return request.get('/user/partuser', { params: { org_id } })
}
