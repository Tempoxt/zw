<template>
    <div style="width:300px">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="0" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="70" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success" style="margin-bottom:10px"></el-progress>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception" style="margin-bottom:10px"></el-progress>
    </div>
</template>
