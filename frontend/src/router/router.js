import {createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../views/Home.vue';
import BrowsePage from '../views/Browse.vue';
import SearchPage from '../views/Search.vue';
import ContactPage from '../views/Contact.vue';
import AnalyzePage from '../views/Analyze.vue';
import DownloadPage from '../views/Download.vue';
import DocPage from '../views/Documentation.vue';
import BulkPage from '../views/BulkPage.vue';
import SingleCellPage from '../views/SingleCellPage.vue';
import GEAPage from '../views/GEAPage.vue';
import CCAPage from '../views/CCAPage.vue';
import DGAPage from '../views/DGAPage.vue';
import MNAPage from '../views/MNAPage.vue';


const routes=[
    {
        path:'/',
        name:'HomePage',
        component:HomePage
    },
    {
        path:'/browse',
        name:'BrowsePage',
        component:BrowsePage,
        query:{mode:'curated-knowledge'}
    },
    {
        path:'/browse/bulk',
        name:'BulkBrowse',
        component:BrowsePage,
        query:{mode:'bulk'}
    },
    {
        path:'/browse/bulk_detail',
        name:'BulkPage',
        component:BulkPage,
    },
    {
        path:'/browse/single-cell',
        name:'SCBrowse',
        component:BrowsePage,
        query:{mode:'single-cell'}
    },
    {
        path:'/browse/sc_detail',
        name:'SingleCellPage',
        component:SingleCellPage,
    },
    {
        path:'/contact',
        name:'ContactPage',
        component:ContactPage
    },
    {
        path:'/analyze',
        name:'AnalyzePage',
        component:AnalyzePage
    },
    {
        path:'/analyze/GEA',
        name:'GEAPage',
        component:GEAPage
    },
    {
        path:'/analyze/CCA',
        name:'CCAPage',
        component:CCAPage
    },
    {
        path:'/analyze/DGA',
        name:'DGAPage',
        component:DGAPage
    },
    {
        path:'/analyze/MNA',
        name:'MNAPage',
        component:MNAPage
    },
    {
        path:'/download',
        name:'DownloadPage',
        component:DownloadPage
    },
    {
        path:'/documentation',
        name:'DocPage',
        component:DocPage
    },
    {
        path:'/search',
        name:'SearchPage',
        component:SearchPage
    },
    {
        path:'/bulk_browse',
        name:'BulkPage',
        component:BulkPage
    },
    {
        path:'/singlecell_browse',
        name:'SingleCellPage',
        component:SingleCellPage
    }
]
const router =createRouter({
    history:createWebHashHistory(),
    routes
})

export default router