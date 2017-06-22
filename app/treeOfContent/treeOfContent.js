define(['repositories/courseRepository', 'treeOfContent/treeNodes/SectionTreeNode', 'plugins/router', 'treeOfContent/utils/screenResolutionChecker', 'plmUtils'],
function (courseRepository, SectionTreeNode, router, screenResolutionChecker, plmUtils) {
    var viewModel = {
        children: [],
        hasChildren: false,
        isExpanded: ko.observable(true),
        isQuestionActivated: false,
        state: {
            isExpanded: false,
            isExpandedForQuestionView: true
        },
        toggleIsExpanded: toggleIsExpanded,
        activate: activate,
        deactivate: deactivate,
        initializeRoute: initializeRoute,
        activateQuestion: activateQuestion,
        showSectionsHeader: ko.observable()
    };

    return viewModel;

    function activate() {
        var self = this;
        plmUtils.getShowSectionsHeaderSetting().then(function (showSectionsHeader) {
            self.showSectionsHeader(showSectionsHeader);
        });

        viewModel.children = _.chain(courseRepository.get().sections)
                .map(function (section) {
                    var treeNode = new SectionTreeNode(section.id, section.title);
                    treeNode.activate();
                    return treeNode;
                })
                .value();

        viewModel.hasChildren = viewModel.children.length > 0;
        viewModel.initializeRoute();
        router.on('router:navigation:complete', viewModel.initializeRoute);
    }

    function deactivate() {
        router.off('router:navigation:complete', viewModel.initializeRoute);
        viewModel.children = [];
        viewModel.hasChildren = false;
    }

    function toggleIsExpanded() {
        viewModel.isExpanded(!viewModel.isExpanded());
        if (viewModel.isQuestionActivated) {
            viewModel.state.isExpandedForQuestionView = viewModel.isExpanded();
        } else {
            viewModel.state.isExpanded = viewModel.isExpanded();
        }
    }

    function initializeRoute() {
        var activeInstruction = router.activeInstruction();
        if (!activeInstruction || !activeInstruction.fragment) {
            return;
        }

        var isQuestionActivatedForPreviousRoute = viewModel.isQuestionActivated;
        viewModel.isQuestionActivated = viewModel.activateQuestion('#' + activeInstruction.fragment);
        if (viewModel.isQuestionActivated) {
            if (!isQuestionActivatedForPreviousRoute) {
                viewModel.children.forEach(function (section) {
                    section.isExpanded(section.hasActiveQuestion());
                });
            }
        } else {
            viewModel.children.forEach(function (section, index) {
                section.isExpanded(index === 0);
            });
        }

        var isExpanded = false;
        if (!screenResolutionChecker.isLowResolution()) {
            isExpanded = viewModel.isQuestionActivated ? viewModel.state.isExpandedForQuestionView : viewModel.state.isExpanded;
        }

        viewModel.isExpanded(isExpanded);
    }

    function activateQuestion(url) {
        var isQuestionActivated = false;
        viewModel.children.forEach(function (section) {
            if (section.activateQuestion(url)) {
                isQuestionActivated = true;
            }
        });

        return isQuestionActivated;
    }
});