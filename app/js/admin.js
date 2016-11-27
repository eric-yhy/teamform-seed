$(document).ready(function () {

    $('#admin_page').hide();
    $('#inviteJoinDiv').hide();
    $('#text_event_name').text("Error: Invalid event id ");
    var eventid = getURLParameter("q");
    if (eventid != null && eventid !== '') {
        $('#text_event_name').text("Event ID: " + eventid);
    }
});

angular.module('teamform-admin-app', ['firebase'])
    .controller('AdminCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function ($scope, $firebaseObject, $firebaseArray, $window) {

        // TODO: implementation of AdminCtrl
        var load_screen = document.getElementById("load_screen");
        // Initialize $scope.param as an empty JSON object
        $scope.param = {}; //event.{eventid}.admin.param
        $scope.editable = false;
        $scope.writingAnnouncement = false;
        $scope.loggedIn = true;

        // Call Firebase initialization code defined in site.js
        initalizeFirebase();

        console.log("get into controller");

        var refPath, ref, eventid; //ref for sqecified event

        eventid = getURLParameter("q");
        console.log("event id : " + eventid)

        // Link and sync a firebase object
        refPath = "events/" + eventid + "/admin/param";
        ref = firebase.database().ref(refPath);
        $scope.param = $firebaseObject(ref);
        $scope.param.$loaded()
            .then(function (data) {
                // // Fill in some initial values when the DB entry doesn't exist
                console.log("loaded: " + $scope.param.eventName);
                console.log("loaded: " + $scope.param);
                if (typeof $scope.param.eventName == "undefined") {
                    $scope.param.eventName = "";
                }
                if (typeof $scope.param.admin == "undefined") {
                    $scope.param.admin = $scope.uid;
                }
                if (typeof $scope.param.description == "undefined") {
                    $scope.param.description = "This is team form for " + $scope.param.eventName + ".";
                }
                if (typeof $scope.param.maxTeamSize == "undefined") {
                    $scope.param.maxTeamSize = 10;
                }
                if (typeof $scope.param.minTeamSize == "undefined") {
                    $scope.param.minTeamSize = 1;
                }
                if (typeof $scope.param.deadline == "undefined") {
                    $scope.deadline = new Date(new Date().setDate(new Date().getDate() + 30));//outside new Date: change string to date object, 2nd Date: create date, 3rd Date: get today day
                } else {

                    $scope.deadline = new Date($scope.param.deadline);
                    console.log("$scope.deadline\n$scope.deadline: " + new Date($scope.deadline) + "\ntypeof: " + typeof $scope.deadline);
                }
                $scope.today = new Date(new Date().setDate(new Date().getDate()));
                $scope.getUserNameByID($scope.param.admin, function (resultFromCallback) {
                    $scope.adminName = resultFromCallback;
                    console.log("resultFromCallback: " + $scope.adminName);
                })
                // $scope.adminName=$scope.getUserNameByID($scope.param.admin);
                // Enable the UI when the data is successfully loaded and synchornized
                $('#text_event_name').text("Event Name: " + $scope.param.eventName);
                $('#admin_page').show();
                var load_screen = document.getElementById("load_screen");
                document.body.removeChild(load_screen);
            })
            .catch(function (error) {
                // Database connection error handling...
                //console.error("Error:", error);
            });

        refPath = "events/" + eventid + "/teams";
        $scope.teams = [];
        $scope.teams = $firebaseArray(firebase.database().ref(refPath));

        refPath = "events/" + eventid + "/announcements";
        $scope.announcements = [];
        $scope.announcements = $firebaseArray(firebase.database().ref(refPath));

        refPath = "events/" + eventid + "/waitlist";
        $scope.waitList = [];
        $scope.waitList = $firebaseArray(firebase.database().ref(refPath));
        //$scope.waitList.$loaded();

        $scope.getUserNameInTeam = function (team) {
            var resultName;
            console.log("getUserNameInTeam for team" + team);
            $scope.getUserNameByID(team.teamLeader, function (resultFromCallback) {
                resultName = resultFromCallback;
                console.log("Leader: getMemberNameByID: " + resultName);
                team.teamLeaderName = resultName;
            })
            angular.forEach(team.members, function (member, key) {
                $scope.getUserNameByID(member.memberID, function (resultFromCallback) {
                    resultName = resultFromCallback;
                    //console.log("Member: getMemberNameByID: "+ resultName);
                    member.memberName = resultName;
                    console.log("member: " + member.memberID + "\nmember: " + member.memberName);
                    team.memberNames = [];
                    team.memberNames.push(resultName);
                })
                console.log("team.members: " + team.members);
                console.log("team.memberNames: " + team.memberNames);
            })
        }

        $scope.getUserDatabyID = function (user) {
            var resultName;
            console.log("getUserDatabyID for " + user);
            $scope.getUserNameByID(user.uid, function (resultFromCallback) {
                user.name = resultFromCallback;
                console.log("Leader: getMemberNameByID: " + user.name);
            })
            var userPreference = $firebaseObject(firebase.database().ref('users/' + user.uid + '/language'));
            userPreference.$loaded()
                .then(function (data) {
                    user.preference = userPreference;
                    console.log("user.preference" + user.preference);
                    angular.forEach(user.preference, function (p) {
                        console.log("preference?" + p);
                    })
                })
        }

        $scope.getUserNameByID = function (userid, callback) {
            var foundName;
            var userDatabase = firebase.database();
            var userRef = userDatabase.ref('users/' + userid + '/name');
            var userData = $firebaseObject(userRef);
            userData.$loaded()
                .then(function (data) {
                    //console.log("getUserNameByID: "+userData.$value);
                    callback(userData.$value);
                })
        }

        $scope.edit_click = function () {
            $scope.editable = true;
        };

        $scope.close_event_click = function () {
            if (confirm("After close event, deadline will be set to current time and members cannot take any action, including request to join, invite others, accept request or accept invite.")) {
                $scope.deadline = $scope.today;
                $scope.param.deadline = $scope.deadline.toISOString();
                $scope.param.$save();
            } else {
                //cancel, not thing done
            }
        };

        $scope.reopen_event_click = function () {
            //TODO:
            if (confirm("After reopen event, deadline will be set to one week later. You can modify the deadline by edit function.")) {
                $scope.deadline = new Date(new Date().setDate(new Date().getDate() + 7));
                $scope.param.deadline = $scope.deadline.toISOString();
                $scope.param.$save();
            } else {
                //cancel, not thing done
            }
        };

        $scope.generate_click = function () {
            //jump to generateTeam page since The view may be complicated depend on number of members and team size
            //jump to new page for confirm
            var url = "teamGenerator.html?q=" + eventid;
            window.location.href = url;
        }

        $scope.new_announcement_click = function () {
            $scope.writingAnnouncement = true;
        }

        $scope.make_announcement = function (announcement_text) {
            if (announcement_text == "" || announcement_text == null) {
                $window.alert("Announcement cannot be empty.");
            } else {
                console.log("Save Announcement to firebase");
                var announcementRefPath = "events/" + eventid + "/announcements/";
                console.log(announcementRefPath);
                announcementRefPath = announcementRefPath + firebase.database().ref(announcementRefPath).push().key;
                //key of announcements = date & time
                //val of Announcement = announcement text
                announcementRef = $firebaseObject(firebase.database().ref(announcementRefPath));
                announcementRef.text = announcement_text;
                announcementRef.date = new Date().toISOString();
                announcementRef.$save();
                $scope.writingAnnouncement = false;
            }
        }

        $scope.del_announcement_click = function (announcement_object) {
            console.log("Remove announcement \n announcement: " + announcement_object.text + "\n announcement_object.id: " + announcement_object.$id);
            $firebaseObject(firebase.database().ref("events/" + eventid + "/announcements/" + announcement_object.$id)).$remove();
        }

        $scope.edit_announcement_click = function (announcement_object) {
            console.log("edit announcement \n announcement: " + announcement_object.text + "\n announcement_object.id: " + announcement_object.$id);
            var newText = prompt("Edit Announcement", announcement_object.text);
            if (newText != null) {
                console.log("edit announcement edited: " + newText);
                var tempObj = $firebaseObject(firebase.database().ref("events/" + eventid + "/announcements/" + announcement_object.$id));
                tempObj.$loaded().then(function () {
                    tempObj.text = newText;
                    tempObj.date = new Date().toISOString();
                    tempObj.$save();
                })
            } else {
                console.log("edit announcement canceled");
            }
        }

        $scope.dismissTeam = function (team, moveToWaitList) {
            var teamName = team.teamName;
            var teamid = team.$id;
            console.log("teamid: " + teamid);
            //first, remove role of user that inside the team		
            //leader
            $firebaseObject(firebase.database().ref("users/" + team.teamLeader + "/teams/" + eventid)).$remove();
            //members
            angular.forEach(team.members, function (member, index) {
                $firebaseObject(firebase.database().ref("users/" + member.memberID + "/teams/" + eventid)).$remove();
            })
            //if moveToWaitList is true, save to events/eventid/waitList
            if (moveToWaitList) {//not updated, but this function not used in this page; the updated version in teamGenerator.js
                refPath = "events/" + eventid + "/waitList";
                waitList = [];
                waitList = $firebaseArray(firebase.database().ref(refPath));
                waitList.$loaded().them(function () {
                    waitList.$add(team.teamLeader);
                    angular.forEach(team.members, function (member, index) {
                        waitList.$add(member.memberID);
                    })
                })
                waitList.$save();
            }
            //second, del all data of this team
            $firebaseObject(firebase.database().ref("events/" + eventid + "/teams/" + teamid)).$remove();
            console.log("ref: " + "events/" + eventid + "/teams/" + teamid);
            console.log("team " + teamName + " is deleted. ")
        }

        // //create team function 
        // $scope.eventid = eventid;
        // $scope.createTeam = function (teamName) {
        // 	var teamNameVal = $('#teamName').val();
        // 	if (teamNameVal == undefined) {
        // 		teamNameVal = teamName;
        // 	}
        // 	console.log(teamNameVal);
        // 	console.log('creating team');
        // 	var ref = firebase.database().ref('events/' + $scope.eventid + '/teams/');
        // 	console.log($scope.eventid);
        // 	var teamkey = ref.push().key;
        // 	console.log(teamkey);
        // 	var event = $firebaseObject(ref);
        // 	event.$loaded()
        // 		.then(function (data) {
        // 			//console.log(data);
        // 			var newteamRef = firebase.database().ref('events/' + $scope.eventid + '/teams/' + teamkey);
        // 			var teamobject = $firebaseObject(newteamRef);
        // 			teamobject.teamName = teamNameVal;
        // 			teamobject.teamLeader = $scope.uid;
        // 			teamobject.$save();
        // 			console.log(teamobject);

        // 			var currentUser = firebase.auth().currentUser;
        // 			var currentUsersRef = firebase.database().ref('users/' + currentUser.uid + '/teams/' + teamkey);
        // 			var userNewTeamObject = $firebaseObject(currentUsersRef);
        // 			if (userNewTeamObject.role != 'admin') {
        // 				userNewTeamObject.role = 'leader';
        // 			}
        // 			userNewTeamObject.teamid = teamkey;
        // 			userNewTeamObject.$save();
        // 			console.log(userNewTeamObject);
        // 		});
        // 	if (teamNameVal == '') {
        // 		var url = "team.html?teamid=" + teamkey + "&eventid=" + $scope.eventid;
        // 		//	window.location.href = url;
        // 		return false;
        // 		//user will enter team page which is created by user who become leader
        // 	} else {
        // 		//	var url = "team.html?teamid=" + teamkey+ "&eventid="+$scope.eventid;
        // 		var url = "leader.html?teamid=" + teamkey + "&eventid=" + $scope.eventid;
        // 		window.location.href = url;
        // 		return true;
        // 	}
        // }

        $scope.kick = function (kickUid) {//remove std from wait list and change std isjoin to false
            console.log("kick");
            //remove from waitlist
            waitListArray = $firebaseArray(firebase.database().ref('events/' + eventid + '/waitlist'));
            waitListArray.$loaded().then(function () {
                angular.forEach(waitListArray, function (waitingMember) {
                    //search the index of user
                    console.log("waiting member: " + waitingMember.$id + "\n" + waitingMember.uid + "\n" + kickUid);
                    if (waitingMember.uid == kickUid) {
                        //waitingMember.$remove();
                        index = waitListArray.$indexFor(waitingMember.$id);
                        console.log(index);
                        waitListArray.$remove(index);
                    }
                })
            })
            //change variable saved in user
            var kickUsersRef = firebase.database().ref('users/' + kickUid + '/teams/' + eventid);
            var kickUserTeamObject = $firebaseObject(kickUsersRef);
            kickUserTeamObject.isJoin = false;
            kickUserTeamObject.$save();
        }

        $scope.changeMinTeamSize = function (delta) {
            var newVal = $scope.param.minTeamSize + delta;
            if (newVal >= 1 && newVal <= $scope.param.maxTeamSize) {
                $scope.param.minTeamSize = newVal;
            }
        }

        $scope.changeMaxTeamSize = function (delta) {
            var newVal = $scope.param.maxTeamSize + delta;
            if (newVal >= 1 && newVal >= $scope.param.minTeamSize) {
                $scope.param.maxTeamSize = newVal;
            }
        }

        $scope.saveFunc = function () {
            if ($scope.param.eventName == "" || $scope.param.eventName == null) {
                $window.alert("Event Name cannot be empty");
            } else {
                console.log("eventname in saveFunc: " + $scope.param.eventName);
                $scope.isEventExist($scope.param.eventName, function (result) {
                    console.log("result:" + result);
                    if (result) {
                        console.log("Event " + $scope.param.eventName + " already exist.");
                        $window.alert("Event " + $scope.param.eventName + " already exist.");
                    } else {
                        console.log("type of $scope.deadline : " + typeof $scope.deadline);
                        console.log("$scope.deadline : " + $scope.deadline);
                        if (typeof $scope.deadline != "undefined") {
                            $scope.param.deadline = $scope.deadline.toISOString();
                        }
                        $scope.param.$save();
                        $('#text_event_name').text("Event Name: " + $scope.param.eventName);
                        $scope.editable = false;
                    }
                })
            }
        }

        $scope.isEventExist = function (eventname, callback) {
            console.log("eventname: " + eventname);
            var ref = firebase.database().ref("events/");
            var eventsList = $firebaseObject(ref);
            var existflag = false;
            eventsList.$loaded(function (data) {
                data.forEach(function (eventObj, key) {
                    console.log("eventObj's key: " + key);
                    if ((eventObj.admin.param.eventName == eventname) && (eventid != key)) {
                        console.log("callback true");
                        existflag = true;
                    }
                })
            }).then(function () {
                callback(existflag);
            });
        }

        $scope.getRole = function (member) {
            // console.log("getRole\nmember: " + member.name);
            if (typeof member.teams != "undefined" && typeof member.teams[eventid] != "undefined") {
                // console.log("getRole\nrole: " + member.teams[eventid]);
                if (typeof member.teams[eventid].role != "undefined") {
                    if (member.teams[eventid].role == "member") member.role = "member";
                    else if (member.teams[eventid].role == "leader") member.role = "leader";
                    else if (member.teams[eventid].role == "admin") member.role = "admin";
                    else {
                        if (member.teams[eventid].isJoin == true) member.role = "waiting";
                        else {
                            member.role = null;
                        }
                    }
                } else {
                    if (member.teams[eventid].isJoin == true) member.role = "waiting";
                    else {
                        member.role = null;
                    }
                }
            } else {
                return null;
            }
        }

        $scope.inviteJoin_click = function () {
            $('#inviteJoinDiv').show();
            document.getElementById("inviteJoinDiv").scrollIntoView();
            document.getElementById("btn_invite_join").className = "btn btn-primary active";
        }

        $scope.inviteJoinDone = function () {
            $scope.scrollToTop();
            $('#inviteJoinDiv').hide();
            document.getElementById("btn_invite_join").className = "btn btn-primary";
        }

        $scope.inviteToJoin = function (member) {
            setTimeout(function () {
                //any code in here will automatically have an apply run afterwards
                member.isJoin = true;
            },0);
            console.log("inviteToJoin\n" + member.isJoin);
            // member.$apply();
            //set isJoin in user ref to true
            console.log("invite to join\n" + $scope.users.$getRecord(member.$id));
            userNewTeamObject = $firebaseObject(firebase.database().ref("users/" + member.$id + "/teams/" + eventid));
            console.log("users/" + member.$id + "/teams/" + eventid);
            userNewTeamObject.$loaded().then(function () {
                userNewTeamObject.isJoin = true;
                userNewTeamObject.$save();
            })

            //add to waitlist
            waitListArray = $firebaseArray(firebase.database().ref('events/' + eventid + '/waitlist'));
            waitListArray.$loaded().then(function () {
                if (typeof waitListArray == "undefined") { waitListArray = []; }
                waitListArray.$add({ "uid": member.$id });
            })
        }

        //$scope.users is an array of users in firebase
        var usersRef = firebase.database().ref('users');
        $scope.users = $firebaseArray(usersRef);


        $scope.scrollToTop = function () {
            $window.scrollTo(0, 0);
        }
        //logout function
        $scope.logout = function () {
            firebase.auth().signOut();
        }

        //monitor if the user is logged in or not
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('logged in');
                var database = firebase.database();
                var usersRef = database.ref('users/' + user.uid);
                var currentUserData = $firebaseObject(usersRef);
                currentUserData.$loaded()
                    .then(function (data) {
                        $scope.username = currentUserData.name;
                    })
                    .catch(function (error) {
                        console.error("Error: " + error);
                    });
                $scope.loggedIn = true;
                $scope.uid = user.uid;
                eventid = getURLParameter("q");
                refPath = "events/" + eventid + "/admin/param";
                ref = firebase.database().ref(refPath);
                $scope.param = $firebaseObject(ref);
                $scope.param.$loaded().then(function (data) {
                    if ($scope.param.admin != user.uid) {//check if user is admin of this event
                        console.log('admin: ' + $scope.param.admin + ', user: ' + user.uid);
                        console.log('not admin');
                        $window.alert("Permission Denied. \n You are not admin of this event")
                        $window.location.href = '/index.html';
                    }
                })
                load_screen.hide();
            } else {
                console.log('not log in');
                $window.location.href = '/index.html';
            }
        })
    }]);