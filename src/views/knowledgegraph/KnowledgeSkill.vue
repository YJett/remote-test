<template>
    <div>
        <el-header>
            <!-- Header content -->
            <el-switch v-model="switchValue"></el-switch>
            <el-input v-model="inputValue"></el-input>
            <el-button @click="showRelationDialog">关联实体</el-button>
            <el-button @click="showAddEntityDialog">添加实体</el-button>
            <el-button @click="showEditEntityDialog">修改实体</el-button>
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

        <!-- Relation Dialog -->
        <el-dialog
            title="关联实体"
            :visible.sync="relationDialogVisible"
            width="30%"
            top="10vh"
            :before-close="handleDialogClose"
        >
            <el-form ref="relationForm" :model="relationForm" label-width="120px">
                <el-form-item label="实体1：知识图谱">
                    <el-input v-model="relationForm.entity1" disabled></el-input>
                </el-form-item>
                <el-form-item label="实体2：技能图谱">
                    <el-input v-model="relationForm.entity2" disabled></el-input>
                </el-form-item>
                <el-form-item label="关系名称">
                    <el-input v-model="relationForm.relationName"></el-input>
                </el-form-item>
                <el-form-item label="关系方向">
                    <el-radio-group v-model="relationForm.direction">
                        <el-radio label="正向关系">正向关系</el-radio>
                        <el-radio label="逆向关系">逆向关系</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="relationDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addRelation">确定</el-button>
            </div>
        </el-dialog>

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
            skillGraphData: null,
            relationDialogVisible: false,
            relationForm: {
                entity1: '',
                entity2: '',
                relationName: '',
                direction: '正向关系'
            }
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
        // Method to show relation dialog
        showRelationDialog() {
            if (this.currentClickNodeKnowledge && this.currentClickNodeSkill) {
                this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
                this.relationForm.entity2 = JSON.stringify(this.currentClickNodeSkill);
                this.relationDialogVisible = true;
            } else {
                this.$message.error('请先选择知识图谱和技能图谱中的节点！');
            }
        },
        // Method to add relation
        addRelation() {
            // Logic to add relation
            this.relationDialogVisible = false;
            this.$message.success('成功添加关联关系！');
        },
        // Method to show add entity dialog
        showAddEntityDialog() {
            // Logic to show add entity dialog
            this.$message.info('添加实体功能暂未实现！');
        },
        // Method to show edit entity dialog
        showEditEntityDialog() {
            // Logic to show edit entity dialog
            this.$message.info('修改实体功能暂未实现！');
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
