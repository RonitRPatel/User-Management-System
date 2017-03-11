angular.module('userControllers',['userServices','authServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

    var app = this;

    this.regUser = function(regData, valid){
        app.errorMsg = false;
        app.successMsg = false;
        app.loading = true;

        if(valid){
            User.create(app.regData).then(function(data){
                if(data.data.success){
                    app.loading = false;
                    app.successMsg = data.data.message + ' ...Redirecting!';
                    $timeout(function(){
                        $location.path('/');
                    },2000);
                }
                else{
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        }
        else{
            app.loading = false;
            app.errorMsg = 'Please ensure form is filled out properly!';
        }

    };

    this.checkUsername = function(regData){
        app.checkingUsername = true;
        app.usernameMsg = false;
        app.usernameInvalid = false;

        User.checkUsername(app.regData).then(function(data){
            if(data.data.success){
                app.checkingUsername = false;
                app.usernameInvalid = false;
                app.usernameMsg = data.data.message;
            }
            else{
                app.checkingUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            };
        });
    };


    this.checkEmail = function(regData){
        app.checkingEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false;

        User.checkEmail(app.regData).then(function(data){
            if(data.data.success){
                app.checkingEmail = false;
                app.emailInvalid = false;
                app.emailMsg = data.data.message;
            }
            else{
                app.checkingEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        });
    };
})

.controller('searchCtrl', function($http,$scope){
    var app = this;
    $http.get('/api/search').then(function(data){
        $scope.users = [];
        $scope.users = data;
        app.checker = false;
        console.log($scope.users);
    });

    $scope.displayer = function(){
        app.checker = true;
    }
})


.directive('match', function(){
    return {
        restrict: 'A',
        controller: function($scope){

            $scope.confirmed = false;

            $scope.doConfirm = function(values){
                values.forEach(function(ele){

                    if($scope.confirm == ele){
                        $scope.confirmed = true;
                    }
                    else{
                        $scope.confirmed = false;
                    }
                });
            }
        },

        link: function(scope, element, attrs){

            attrs.$observe('match', function(){
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

            scope.$watch('confirm', function(){
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
})

.controller('facebookCtrl', function($routeParams,Auth,$location,$window){
    var app = this;
    if($window.location.pathname == '/facebookerror'){
        app.errorMsg = 'Facebook Email Not Found in Database!';
    }
    else{
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
});