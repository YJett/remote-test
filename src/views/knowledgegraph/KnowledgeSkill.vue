<template>
    <div>
        <el-header>
            <!-- Header content -->
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>
            <el-button>Button 1</el-button>
            <el-button>Button 2</el-button>
            <el-button>Button 3</el-button>
        </el-header>

        <div class="graph-container">
            <!-- Knowledge Graph -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>知识图谱</span>
                </div>
                <div class="el-card__body">
                    <div id="knowledge-graph" class="graph"></div>
                </div>
            </el-card>

            <!-- Skill Graph -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>技能图谱</span>
                </div>
                <div class="el-card__body">
                    <div id="skill-graph" class="graph"></div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
    data() {
        return {
            switchValue: false,
            inputValue: '',
            currentClickNodeKnowledge: null,
            currentClickNodeSkill: null,
            knowledgeGraphData: null,
            skillGraphData: null
        };
    },
    async mounted() {
        await this.fetchKnowledgeGraphData();
        this.initKnowledgeGraph();
        await this.fetchSkillGraphData();
        this.initSkillGraph();
    },
    methods: {
        async fetchKnowledgeGraphData() {
            // Fetch data from backend here for the knowledge graph
            // For now, we'll just use some dummy data
            this.knowledgeGraphData = {
                nodes: [
                    { id: 'node1', label: 'Node 1' },
                    { id: 'node2', label: 'Node 2' },
                    { id: 'node3', label: 'Node 3' },
                ],
                edges: [
                    { source: 'node1', target: 'node2' },
                    { source: 'node2', target: 'node3' },
                ]
            };
        },
        async fetchSkillGraphData() {
            // Fetch data from backend here for the skill graph
            // For now, we'll just use some dummy data
            this.skillGraphData = {
                nodes: [
                    { id: 'nodeA', label: 'Node A' },
                    { id: 'nodeB', label: 'Node B' },
                    { id: 'nodeC', label: 'Node C' },
                ],
                edges: [
                    { source: 'nodeA', target: 'nodeB' },
                    { source: 'nodeB', target: 'nodeC' },
                ]
            };
        },
        initKnowledgeGraph() {
            const knowledgeGraph = new G6.Graph({
                container: 'knowledge-graph',
                layout: {
                    type: 'force',
                    preventOverlap: true,
                },
                defaultNode: {
                    size: [50, 50],
                    style: {
                        fill: '#9EC9FF',
                        stroke: '#5B8FF9',
                    },
                    labelCfg: {
                        style: {
                            fill: '#000',
                            fontSize: 10,
                        },
                    },
                },
                nodeStateStyles: {
                    selected: {
                        fill: 'lightblue',
                    },
                },
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node'],
                },
            });
            knowledgeGraph.data(this.knowledgeGraphData);
            knowledgeGraph.render();

            knowledgeGraph.on('node:click', (e) => {
                const nodeItem = e.item;
                this.currentClickNodeKnowledge = {
                    graph: 'knowledge',
                    id: nodeItem.getModel().id,
                };
            });
        },
        initSkillGraph() {
            const skillGraph = new G6.Graph({
                container: 'skill-graph',
                layout: {
                    type: 'force',
                    preventOverlap: true,
                },
                defaultNode: {
                    size: [50, 50],
                    style: {
                        fill: '#9EC9FF',
                        stroke: '#5B8FF9',
                    },
                    labelCfg: {
                        style: {
                            fill: '#000',
                            fontSize: 10,
                        },
                    },
                },
                nodeStateStyles: {
                    selected: {
                        fill: 'lightblue',
                    },
                },
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node'],
                },
            });

            skillGraph.data(this.skillGraphData);
            skillGraph.render();

            skillGraph.on('node:click', (e) => {
                const nodeItem = e.item;
                this.currentClickNodeSkill = {
                    graph: 'skill',
                    id: nodeItem.getModel().id,
                };
            });
        },
    },
    beforeDestroy() {
        // Destroy the knowledge graph and skill graph instances
        if (this.knowledgeGraph) {
            this.knowledgeGraph.destroy();
        }
        if (this.skillGraph) {
            this.skillGraph.destroy();
        }
    }
};
</script>


<style>
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.el-card__body {
    height: 100%;  /* Set the height of the card body */
}
.graph-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80vh;  /* Set the height of the container to 80% of the viewport height */
}

.box-card {
    margin: 10px;
    flex: 1;
}

.graph {
    height: 100%;
}
</style>
