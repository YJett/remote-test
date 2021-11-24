<template>
    <div class="demo-split">
        <Split v-model="split3">
            <div slot="left" class="demo-split-pane">
                <k-chart></k-chart>
            </div>
            <div slot="right" class="demo-split-pane no-padding">
                    <Split v-model="split4" mode="vertical">
                        <div slot="top" class="demo-split-pane">
                            <order-book></order-book>
                        </div>
                        <div slot="bottom" class="demo-split-pane">
                            <latest-deal></latest-deal>
                        </div>
                    </Split>
                </div>
        </Split>
    </div>
</template>

<script>
import KChart from '../components/KChart'
import LatestDeal from '../components/LatestDeal'
import OrderBook from '../components/OrderBook'

export default {
    name: 'Trade',
    components: {
        KChart,
        LatestDeal,
        OrderBook,
    },
    data() {
        return {
            split3: 0.7,
            split4: 0.625,
        }
    },
}
</script>

<style>
    .demo-split{
        height: 80%;
        border: 1px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
    .demo-split-pane.no-padding{
        height: 100%;
        padding: 0;
    }

</style>
