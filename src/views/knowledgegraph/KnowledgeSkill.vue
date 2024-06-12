<template>
    <div>
        <el-header>
            <!-- Header content -->
            <el-switch v-model="switchValue"></el-switch>
            <el-button @click="showRelationDialog">关联实体</el-button>
            <el-button @click="showAddEntityDialog">添加实体</el-button>
            <el-button @click="showEditEntityDialog">修改实体</el-button>
        </el-header>

        <div class="graph-container">
            <!-- Knowledge Graph -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>知识图谱</span>
                    <!-- Add tags to show node counts -->
                    <el-tag
                        v-for="(count, type) in KnowNodeTypeCounts"
                        :key="type"
                        @click="filterKnowNodeType(type)"
                        style="cursor: pointer; margin-left: 10px;"
                    >
                        {{ `${type}(${count})` }}
                    </el-tag>
                    <el-tag
                        :key="'all'"
                        @click="filterKnowNodeType('all')"
                        style="cursor: pointer; margin-left: 10px;"
                    >
                        {{ `所有类型(${allKnowNodeTypesCount})` }}
                    </el-tag>
                    <div class="sch-input">
                        <Select v-model="selectedSchool" placeholder="请选择school" @on-change="handleSchChange"
                                style="width: 200px; font-size: 18px;">
                            <Option v-for="school in schools" :key="school.schId" :value="school.value">{{ school.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="el-card__body">
                    <div id="knowledge-graph" class="graph"></div>
                </div>
            </el-card>

            <!-- Skill Graph -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>技能图谱</span>
                    <el-tag
                        v-for="(count, type) in SkillNodeTypeCounts"
                        :key="type"
                        @click="filterSkillNodeType(type)"
                        style="cursor: pointer; margin-left: 10px;"
                    >
                        {{ `${type}(${count})` }}
                    </el-tag>
                    <el-tag
                        :key="'all'"
                        @click="filterSkillNodeType('all')"
                        style="cursor: pointer; margin-left: 10px;"
                    >
                        {{ `所有类型(${allSkillNodeTypesCount})` }}
                    </el-tag>
                    <el-tag
                        :key="'refresh'"
                        @click="fetchSkillGraphData"
                        style="cursor: pointer; margin-left: 10px;"
                    >
                        {{ `刷新` }}
                    </el-tag>
                    <div class="job-input">
                        <Select v-model="selectedJobId" placeholder="请选择Job" @on-change="handleJobChange"
                                style="width: 200px; font-size: 18px;">
                            <Option v-for="job in jobs" :key="job.jobId" :value="job.value">{{ job.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="el-card__body">
                    <div id="skill-graph" class="graph"></div>
                </div>
            </el-card>
        </div>

        <!-- Relation Dialog -->
        <el-dialog title="关联实体" :visible.sync="relationDialogVisible" width="30%" top="10vh">
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
import G6 from "@antv/g6";
import { kgBuilderApi } from "@/api";
import {fetchAllSchools} from "@/api/schmanage";
import { fetchAllJobs } from '@/api/Jobmanage';
import { insertJbAbilityKnowledge } from "@/api/JbAbilityKnowledge";
import {Message} from "view-design";

const KNOWLEDGEANDSHIP = `MATCH (n:KnowledgePoint) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;
const SKILLANDSHIP = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`;

export default {
    data() {
        return {
            expandedNodes: {},
            selectedIdentity: 'sch',
            selectedJobName: '',
            selectedJobId:'', // 存储当前选中的 jobId
            jobs: [],
            selectedSchName: '',
            schools: [],
            switchValue: false,
            inputValue: "",
            selectedSchool: '',
            selectedJob: "",
            schoolList: [],
            jobList: [],
            currentClickNodeKnowledge: null,
            currentClickNodeSkill: null,
            allKnowNodeTypesCount: 0,
            knowledgeUnitCount: 0,
            knowledgeGraphCount: 0,
            knowledgeObjectCount: 0,
            topicKnowledgePointCount: 0,
            KnowNodeTypeCounts: {
                knowledgeUnit: 0,
                knowledgeGraph: 0,
                knowledgeObject: 0,
                topicKnowledgePoint: 0
            },
            allSkillNodeTypesCount: 0,
            skillUnitCount: 0,
            skillGraphCount: 0,
            skillObjectCount: 0,
            topicSkillPointCount: 0,
            SkillNodeTypeCounts: {
                skillUnit: 0,
                skillGraph: 0,
                skillObject: 0,
                topicSkillPoint: 0
            },
            knowledgeGraphData: {
                nodes: [
                    { id: "node1", label: "Node 1" },
                    { id: "node2", label: "Node 2" },
                    { id: "node3", label: "Node 3" }
                ],
                edges: [
                    {
                        source: "node1",
                        target: "node2",
                        label: "This is edge1" // Set the edge name here
                    },
                    {
                        source: "node2",
                        target: "node3",
                        label: "This is edge1" // Set the edge name here
                    }
                ]
            },
            skillGraphData: {
                nodes: [
                    { id: "nodeA", label: "Node A" },
                    { id: "nodeB", label: "Node B" },
                    { id: "nodeC", label: "Node C" }
                ],
                edges: [
                    { source: "nodeA", target: "nodeB" },
                    { source: "nodeB", target: "nodeC" }
                ]
            },
            relationDialogVisible: false,
            relationForm: {
                entity1: "",
                entity2: "",
                relationName: "",
                direction: "正向关系"
            },
            knowledgeGraph: null,
            skillGraph: null
        };
    },
    async mounted() {
        await this.fetchSchools();
        await this.fetchJobs();
        this.fetchKnowledgeGraphData(); // 获取知识图谱数据
        await this.fetchSkillGraphData()
        this.initKnowledgeGraph(); // 初始化知识图谱
        this.initSkillGraph(); // 初始化技能图谱
    //    this.fetchKnowledgeGraphDataAndRenderChart(KNOWLEDGEANDSHIP); // 获取知识图谱数据
    //    this.fetchSkillGraphDataAndRenderChart(SKILLANDSHIP); // 获取技能图谱数据
        this.fetchSchoolList(); // 获取学校列表
        this.fetchJobList(); // 获取 Job 列表
    },
    methods: {
        fetchSchools() {
            fetchAllSchools()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.schools = response.data.map(school => ({
                            value: school.schId,
                            label: school.schName
                        }));
                        console.log(this.schools[0].value);
                        this.selectedSchool = this.schools[0].value;
                        this.selectedSchName = this.schools[0].label;
                    } else {
                        Message.error('Failed to fetch schools: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch schools');
                });
        },
        handleSchChange(schId) {
            console.log(schId);
            this.selectedSchool = schId;
            this.fetchKnowledgeGraphData();
        },
        fetchJobs() {
            fetchAllJobs()
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.jobs = response.data.map(job => ({
                            value: job.jobid,
                            label: job.jobname
                        }));
                        // console.log(this.jobs[0].value);
                        this.selectedJobId = this.jobs[0].value;
                        this.selectedJobName = this.jobs[0].label;
                    } else {
                        Message.error('Failed to fetch jobs: Invalid data format');
                    }
                })
                .catch(error => {
                    Message.error('Failed to fetch jobs');
                });
        },
        handleJobChange(jobId) {
            console.log(jobId);
            if (jobId === 'all') {
                this.selectedJobId = '';
            } else {
                this.selectedJobId = jobId;
            }
            this.fetchSkillGraphData();
        },
        showChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.allNodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 找到所有相关的边，确保边的源节点和目标节点都在当前节点列表中
            const childEdges = this.allEdges.filter(edge =>
                (childNodeIds.includes(edge.source) && this.skillGraphData.nodes.some(n => n.id === edge.target)) ||
                (childNodeIds.includes(edge.target) && this.skillGraphData.nodes.some(n => n.id === edge.source))
            );

            // 合并新节点和边到现有数据中
            this.skillGraphData.nodes = [...this.skillGraphData.nodes, ...childNodes];
            this.skillGraphData.edges = [...this.skillGraphData.edges, ...childEdges];

            // 更新图表数据
            this.skillGraph.changeData(this.skillGraphData);

            // 记录节点的展开状态
            this.$set(this.expandedNodes, node.id, true);
        }
        ,

        collapseChildNodes(node) {
            const nodeId = node.abilityNo;

            // 找到所有子节点
            const childNodes = this.skillGraphData.nodes.filter(n => n.upabilityId === nodeId);
            const childNodeIds = childNodes.map(n => n.id);

            // 移除子节点及其相关的边
            this.skillGraphData.nodes = this.skillGraphData.nodes.filter(n => n.upabilityId !== nodeId);
            this.skillGraphData.edges = this.skillGraphData.edges.filter(edge =>
                !childNodeIds.includes(edge.source) && !childNodeIds.includes(edge.target)
            );

            // 更新图表数据
            this.skillGraph.changeData(this.skillGraphData);

            // 更新节点的展开状态
            this.$set(this.expandedNodes, node.id, false);
        },
        async fetchSkillGraphData() {
            let cypherQuery = `MATCH (n:Skill)-[r]->(m:Skill) RETURN n, r, m LIMIT 100`; // 默认查询
            console.log(this.selectedJobId)
            // 如果提供了 参数，修改查询语句以包含 jobId 条件
            if (this.selectedJobId) {
                cypherQuery = `MATCH (n:Skill {jobId: ${this.selectedJobId}}) OPTIONAL MATCH (n)-[r]->(m:Skill) RETURN n, r, m`;
            }

            try {
                const res = await kgBuilderApi.getCypherResult(cypherQuery);
                // 处理查询结果，更新技能图谱数据
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.abilityNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type,
                }));
                // 只展示顶层节点
                let nodes = allNodes.filter(node => node.level === 1);
                let nodeIds = nodes.map(node => node.id);
                let edges = allEdges.filter(edge => nodeIds.includes(edge.source) && nodeIds.includes(edge.target));
                /*
                // 手动添加 job 节点
                if (this.selectedJobId) {
                    const jobNode = {
                        id: `${this.selectedJobId}`,
                        label: this.selectedJobName,
                        jobId: this.selectedJobId,
                        level: 0 // job 节点的层级设为 0
                    };
                    allNodes.push(jobNode); // 将 job 节点添加到 allNodes 中
                    nodes.push(jobNode); // 将 job 节点添加到 nodes 中

                    // 将所有 level === 1 的节点作为 job 节点的子节点
                    nodes.forEach(node => {
                        if (node.level === 1) {
                            const newEdge = {
                                source: jobNode.id,
                                target: node.id,
                                label: 'HAS_CHILD'
                            };
                            allEdges.push(newEdge); // 将新关系添加到 allEdges 中
                            edges.push(newEdge); // 将新关系添加到 edges 中
                        }
                    });
                }
                */
                // 更新图表数据
                this.allNodes = allNodes;
                this.allEdges = allEdges;
                this.skillGraphData = {
                    nodes,
                    edges
                };
                console.log(this.skillGraphData)
                this.skillGraph.changeData(this.skillGraphData);
            } catch (error) {
            }
        },
        fetchSchoolList() {
            // Fetch school list from backend
            // For now, use dummy data
            this.schoolList = [
                { value: "school1", label: "School 1" },
                { value: "school2", label: "School 2" },
                { value: "school3", label: "School 3" }
            ];
        },
        fetchJobList() {
            // Fetch job list from backend
            // For now, use dummy data
            this.jobList = [
                { value: "job1", label: "Job 1" },
                { value: "job2", label: "Job 2" },
                { value: "job3", label: "Job 3" }
            ];
        },
        clearStates(graph) {
            graph.getNodes() &&
            graph.getNodes().forEach(item => {
                if (
                    item.getStates().findIndex(node => {
                        return node === "highlight";
                    }) !== -1
                ) {
                    graph.setItemState(item, "highlight", false);
                }
                if (
                    item.getStates().findIndex(node => {
                        return node === "dark";
                    }) !== -1
                ) {
                    graph.setItemState(item, "dark", false);
                }
            });
            graph.getEdges() &&
            graph.getEdges().forEach(item => {
                if (
                    item.getStates().findIndex(edge => {
                        return edge === "highlight";
                    }) !== -1
                ) {
                    graph.setItemState(item, "highlight", false);
                }
                if (
                    item.getStates().findIndex(edge => {
                        return edge === "dark";
                    }) !== -1
                ) {
                    graph.setItemState(item, "dark", false);
                }
            });
        },
        async fetchKnowledgeGraphData() {
            let cypherQuery = `MATCH (n:KnowledgePoint)-[r]->(m:KnowledgePoint) RETURN n, r, m LIMIT 100`; // 默认查询
            console.log(this.selectedSchool)
            // 如果提供了 参数，修改查询语句以包含 jobId 条件
            if (this.selectedSchool) {
                cypherQuery = `MATCH (n:KnowledgePoint {schId: ${this.selectedSchool}}) OPTIONAL MATCH (n)-[r]->(m:KnowledgePoint) RETURN n, r, m`;
            }

            try {
                const res = await kgBuilderApi.getCypherResult(cypherQuery);
                // 处理查询结果，更新技能图谱数据
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.knowledgeNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type,
                }));
                this.knowledgeGraphData = {
                    nodes:allNodes,
                    edges:allEdges
                };
                console.log(this.knowledgeGraphData)
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
            } catch (error) {
            }
        },
        fetchKnowledgeGraphDataAndRenderChart(cypher) {
            kgBuilderApi.getCypherResult(cypher).then(res => {
                // Calculate node type counts
                let counts = this.KnowNodeTypeCounts;
                let total = res.data.node.length;
                res.data.node.forEach(node => {
                    counts[node.type]++; // Increment the count for the node type
                });
                this.allKnowNodeTypesCount = total;
                this.KnowNodeTypeCounts = counts;
                // Update the graph data
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.knowledgeNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type,
                }));
                this.knowledgeGraphData = {
                    nodes:allNodes,
                    edges:allEdges
                };
                console.log(this.knowledgeGraphData)
                this.knowledgeGraph.changeData(this.knowledgeGraphData);
                console.log(res);
            })
        },
        fetchSkillGraphDataAndRenderChart(cypher) {
            kgBuilderApi.getCypherResult(cypher).then(res => {
                // Calculate node type counts
                let counts = this.KnowNodeTypeCounts;
                let total = res.data.node.length;
                res.data.node.forEach(node => {
                    counts[node.type]++; // Increment the count for the node type
                });
                this.allKnowNodeTypesCount = total;
                this.KnowNodeTypeCounts = counts;
                let allNodes = res.data.node.map(node => ({
                    id: node.uuid,
                    label: node.abilityNm,
                    ...node
                }));
                let allEdges = res.data.relationship.map(rel => ({
                    source: rel.sourceId,
                    target: rel.targetId,
                    uuid: rel.uuid,
                    label: rel.type,
                }));
                this.allNodes = allNodes;
                this.allEdges = allEdges;
                this.skillGraphData = {
                    nodes:allNodes,
                    edges:allEdges
                };
                console.log(this.skillGraphData)
                // Update the graph data
                this.skillGraph.changeData(this.skillGraphData);
                console.log(res);
            })
        },
        initKnowledgeGraph() {
            const menu = new G6.Menu({
                getContent(evt) {
                    return `<ul>
                    <li title='addChild'>Add Child Node</li>
                    </ul>`;
                },
                handleMenuClick(target, item) {
                    if (target.title === 'addChild') {
                        console.log(`Add child node for ${item.getID()}`);
                        console.log(item.getModel());
                        // Here you can add your logic to add a child node
                    }
                },
            });


            const knowledgeGraph = new G6.Graph({
                container: "knowledge-graph",
                layout: {
                    type: 'random',
                    preventOverlap: true,
                    gpuEnabled: true,
                    workerEnabled: true, // 启用 Web Worker

                    linkDistance: 50, // 增加这个值可以使节点间距离更大
                    preventOverlapPadding: 10 // 增加这个值可以使节点间距离更大
                },
                defaultNode: {
                    size: [100, 100], // 改变节点大小
                    style: {
                        fill: "#87CEEB", // 天空蓝填充
                        stroke: "#0F52BA" // 宝石蓝描边
                    },
                    labelCfg: {
                        style: {
                            fill: "#000",
                            fontSize: 14 // 改变标签字体大小
                        }
                    }
                },
                defaultEdge: {
                    style: {
                        stroke: "#F6BD16", // 改变边的颜色
                        lineWidth: 2 // 改变边的宽度
                    },
                    labelCfg: {
                        autoRotate: true // Label follows the edge direction
                    }
                },
                nodeStateStyles: {
                    selected: {
                        fill: "lightblue"
                    }
                },
                modes: {
                    default: ["drag-canvas", "zoom-canvas", "click-select", "drag-node"]
                },
                plugins: [menu]
            });
            knowledgeGraph.data(this.knowledgeGraphData);
            knowledgeGraph.render();
            knowledgeGraph.on("node:dblclick", e => {
                const nodeItem = e.item;
                const currentTime = new Date().toLocaleString(); // 获取当前时间
                console.log("当前节点:", nodeItem.getModel());
                console.log("当前时间:", currentTime);
                    // 获取当前节点的 id
                const nodeId = nodeItem.getModel().id;
                const knowledgeId = nodeItem.getModel().knowledgeId;
                const schId = nodeItem.getModel().schId;
                // 构造 Cypher 查询语句
                let cypherQuery = `MATCH (n {id: ${nodeId}})-[]-(relatedNode) RETURN relatedNode`;
                const cypherQuery2 = `MATCH (kp:KnowledgePoint {knowledgeId: ${knowledgeId}, schId: ${schId}})-[]-(relatedNode) RETURN relatedNode`;
                this.fetchSkillGraphDataAndRenderChart(cypherQuery2);
                });

            knowledgeGraph.on("node:click", e => {

                const nodeItem = e.item;
                console.log(nodeItem.getModel());
                this.currentClickNodeKnowledge = {
                    graph: "knowledge",
                    id: nodeItem.getModel().id,
                    knowledgeId: nodeItem.getModel().knowledgeId,
                    label: nodeItem.getModel().label,

                    node: nodeItem.getModel(),
                };
            });
            knowledgeGraph.on("node:mouseenter", ev => {
                const nodeItem = ev.item;

                // Highlight the node itself
                knowledgeGraph.setItemState(nodeItem, "highlight", true);

                // Get the edges connected to the node
                const connectedEdges = nodeItem.getEdges();

                // Highlight the nodes at the other end of these edges
                connectedEdges.forEach(edge => {
                    const sourceNode = edge.getSource();
                    const targetNode = edge.getTarget();
                    const neighborNode = sourceNode === nodeItem ? targetNode : sourceNode;
                    knowledgeGraph.setItemState(neighborNode, "highlight", true);
                });
            });

            knowledgeGraph.on("node:mouseleave", ev => {
                // Clear all highlights
                this.clearStates(this.knowledgeGraph);
            });


            this.knowledgeGraph = knowledgeGraph;
        },

        initSkillGraph() {
            const menu = new G6.Menu({
                getContent(evt) {
                    return `<ul>
            <li title='addChild'>Add Child Node</li>
            </ul>`;
                },
                handleMenuClick(target, item) {
                    if (target.title === 'addChild') {
                        console.log(`Add child node for ${item.getID()}`);
                        console.log(item.getModel());
                        // Here you can add your logic to add a child node
                    }
                },
            });
            const skillGraph = new G6.Graph({
                container: "skill-graph",
                layout: {
                    type: "fruchterman",
                    preventOverlap: true,
                    workerEnabled: true, // 启用 Web Worker
                    gpuEnabled: true,
                    linkDistance: 100, // 增加这个值可以使节点间距离更大
                    preventOverlapPadding: 30 // 增加这个值可以使节点间距离更大
                },
                defaultNode: {
                    size: [100, 100],
                    style: {
                        fill: "#9EC9FF",
                        stroke: "#5B8FF9"
                    },
                    labelCfg: {
                        style: {
                            fill: "#000",
                            fontSize: 14
                        }
                    }
                },
                defaultEdge: {
                    style: {
                        stroke: "#F6BD16", // 改变边的颜色
                        lineWidth: 2 // 改变边的宽度
                    },
                    labelCfg: {
                        autoRotate: true // Label follows the edge direction
                    }
                },
                nodeStateStyles: {
                    selected: {
                        fill: "lightblue"
                    }
                },
                modes: {
                    default: ["drag-canvas", "zoom-canvas", "click-select", "drag-node"]
                },
                plugins: [menu]
            });

            skillGraph.data(this.skillGraphData);
            skillGraph.render();

            skillGraph.on("node:click", e => {
                const nodeItem = e.item;
                const model = nodeItem.getModel();
                this.currentClickNodeSkill = {
                    graph: "skill",
                    label: model.label,
                    abilityNo: model.abilityNo,
                    id: model.id,
                    node: model
                };
                console.log(model);
                console.log(this.expandedNodes);
                // 判断节点是否已经展开
                if (this.expandedNodes[model.id]) {
                    // 如果已经展开，则收回子节点
                    this.collapseChildNodes(model);
                } else {
                    // 如果未展开，则展示子节点
                    this.showChildNodes(model);
                }
            });

            skillGraph.on("node:mouseenter", ev => {
                const nodeItem = ev.item;

                // Highlight the node itself
                skillGraph.setItemState(nodeItem, "highlight", true);

                // Get the edges connected to the node
                const connectedEdges = nodeItem.getEdges();

                // Highlight the nodes at the other end of these edges
                connectedEdges.forEach(edge => {
                    const sourceNode = edge.getSource();
                    const targetNode = edge.getTarget();
                    const neighborNode = sourceNode === nodeItem ? targetNode : sourceNode;
                    skillGraph.setItemState(neighborNode, "highlight", true);
                });
            });

            skillGraph.on("node:mouseleave", ev => {
                // Clear all highlights
                this.clearStates(this.skillGraph);
            });

            this.skillGraph = skillGraph;
        },
        showRelationDialog() {
            if (this.currentClickNodeSkill) {
                this.relationForm.entity1 = JSON.stringify(this.currentClickNodeKnowledge);
                this.relationForm.entity2 = JSON.stringify(this.currentClickNodeSkill);
                this.relationDialogVisible = true;
                insertJbAbilityKnowledge(this.selectedSchool,this.currentClickNodeSkill.abilityNo,this.currentClickNodeKnowledge.knowledgeId).then(res => {
                    this.$Message.success('关联成功');
                });
            } else {
                this.$message.error("请先选择知识图谱和技能图谱中的节点！");
            }
        },
        addRelation() {
            // Add relation between knowledge and skill nodes
            this.$message({
                type: "success",
                message: "关系添加成功"
            });
            this.relationDialogVisible = false;
        },
        showAddEntityDialog() {
            // Show add entity dialog
        },
        showEditEntityDialog() {
            // Show edit entity dialog
        },
        filterKnowNodeType(type) {
            if (type === "all") {
                this.knowledgeGraph.getNodes().forEach(node => {
                    this.knowledgeGraph.showItem(node);
                });
            } else {
                this.knowledgeGraph.getNodes().forEach(node => {
                    if (node.getModel().type === type) {
                        this.knowledgeGraph.showItem(node);
                    } else {
                        this.knowledgeGraph.hideItem(node);
                    }
                });
            }
        },
        filterSkillNodeType(type) {
            if (type === "all") {
                this.skillGraph.getNodes().forEach(node => {
                    this.skillGraph.showItem(node);
                });
            } else {
                this.skillGraph.getNodes().forEach(node => {
                    if (node.getModel().type === type) {
                        this.skillGraph.showItem(node);
                    } else {
                        this.skillGraph.hideItem(node);
                    }
                });
            }
        }
    }
};
</script>

<style scoped>
.graph-container {
    display: flex;
    justify-content: space-between;
}

.graph {
    width: 100%;
    height: 500px;
}

.box-card {
    width: 48%;
}
</style>
