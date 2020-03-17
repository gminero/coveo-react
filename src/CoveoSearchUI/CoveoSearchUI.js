import React, { useEffect, useState } from 'react';
import './CoveoSearchUI.css';

export default function CoveoSearchUI() {
    //declare component variable and local state
    let [searchToken, setToken] = useState(null)
    let [orgId, setOrgid] = useState(null)
    
    // useEffect -> React Hook
    // Data fetching, setting up a subscription, 
    // and manually changing the DOM in React components .
    // Basically : componentDidMount, componentDidUpdate, and 
    // componentWillUnmount combined.
    useEffect(() => {
        //async function for getting search token.
        // calls node server - /getToken
        async function initToken(){
            const serverToken = await fetch('http://localhost:8080/getToken');
            const serverResponse = await serverToken.json();
            setToken(serverResponse.token);
            setOrgid(serverResponse.orgId);
        }
        initToken();
        const root = document.querySelector('#search');
        const Coveo = window.Coveo;
        if(searchToken){
            Coveo.SearchEndpoint.configureCloudV2Endpoint(orgId, searchToken);
            Coveo.init(root);
        }
        Coveo.$$(root).on("afterComponentsInitialization", () => {
            
            Coveo.$$(root).on('queryError', (e, args) => {
                if (args.error.status === 419) {
                    //Something on querrry error - different codes
                }
            });

            Coveo.$$(root).on("querySuccess", (e, args) => {
                //Query success
            });
            Coveo.$$(root).on("newResultsDisplayed", (e, args) => {
                // NewResults Displayed
            });
            Coveo.$$(root).on("preProcessResults", (e, args) => {
                args.results.results.forEach(result => {
                    if (result.raw) {
                        //Do Something
                    }
                });
            });
        });
        
    }, [searchToken, orgId]);

    return(
        <div id="search" className="CoveoSearchInterface"  data-enable-history="true" data-expression="@uri">
            <div className="CoveoAnalytics"></div>
            <div className='coveo-search-section'>
                <div className="CoveoSearchbox" data-enable-omnibox="true"
                    data-placeholder='Search for courses' data-trigger-query-on-clear="true"></div>
            </div>
            <div className="coveo-tab-section">
               
            </div>
            <div className="coveo-main-section">
                <div className="coveo-facet-column">
                    
                </div>
                <div className="coveo-results-column">

                    <div className="CoveoPreferencesPanel">
                        <div className="CoveoResultsPreferences"></div>
                        <div className="CoveoResultsFiltersPreferences"></div>
                    </div>
                    <div className="CoveoTriggers"></div>

                    <div className="coveo-results-header">
                        <div className="coveo-result-layout-section">
                            <span className="CoveoResultLayout"></span>
                        </div>

                    </div>
                    <div className="CoveoHiddenQuery"></div>
                    <div className="CoveoDidYouMean"></div>
                    <div className="CoveoErrorReport" data-pop-up="false"></div>
                    <div className="CoveoResultList" data-layout="list" data-wait-animation="fade" >
                        
                    </div>
                </div>
            </div>
            <div className="coveo-bottom">
                <div className="CoveoPager"></div>
            </div>
        </div>
    );
}
