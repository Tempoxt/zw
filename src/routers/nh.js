export default [
    {
        name: 'invitation_',
        component: () => import('@/views/nh/annualmeeting/invitationcheck'),
        meta:{
            title:'邀请函名单'
        }
    },{
        name: 'winning_list',
        component: () => import('@/views/nh/annualmeeting/winningrecord'),
        meta:{
            title:'中奖名单'
        }
    },
 ]