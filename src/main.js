const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
            cancel: 0,
            kick: 0,
            qr: 0,
        };
        this.messages;
        this.payload;
        this.stateUpload =  {
                file: '',
                name: '',
                group: '',
                sender: ''
            }
    }

    get myBot() {
        const bot = ['u07bea77e0ddbe298a45f2758d834ce48','u79c68416a26d7db88b9d44042dafd4f5','u0e18f39c40973be5f201cc1b00528be4'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message.from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1) { notified_invite_into_group || cancel pas cancel: 1
            if(!isAdminOrBot(operation.param3))
                this._cancel(operation.param1,[operation.param3]);
        }

        if(operation.type == 13) { notified_invite_into_group || bot autojoin grup
            this._acceptGroupInvitation(operation.param1);
        }

        if(operation.type == 11 && this.stateStatus.qr == 1) { notified_update_group || protect qr
            op2 = yg ganti qr
            if(!isAdminOrBot(operation.param2)) {
                this._kickMember(operation.param1,[operation.param2]);
                if(group.preventJoinByTicket == false) {
                    var group = this._getGroup(seq.to);
                    group.preventJoinByTicket = true;
                    this._updateGroup(group);
                }
            }
        }

        if(operation.type == 15) { notified_leave_group || reinv admin klo leave
            op2 = yg left
            if(isAdminOrBot(operation.param2)) {
                this._inviteIntoGroup(operation.param1,[operation.param2]);
            }
        }

        if(operation.type == 19 && this.stateStatus.kick == 1) { notified_kickout_from_group || protect kicker
             op1 = group nya
             op2 = yang 'nge' kick
             op3 = yang 'di' kick
            if(isAdminOrBot(operation.param3)) {
                this._inviteIntoGroup(operation.param1,[operation.param3]);
            }
            if(!isAdminOrBot(operation.param2)) {
                this._kickMember(operation.param1,[operation.param2]);
            }
        }

        if(operation.type == 32) { notified_cancel_invitation_group || reinv admin klo di cancel
            op2 = yg ngecancel
            op3 = yg dicancel
            if(isAdminOrBot(operation.param3)) {
                this._inviteIntoGroup(operation.param1,[operation.param3]);
            }
        }

        if(operation.type == 55){ ada reader
            const idx = this.checkReader.findIndex((v) => {
                if(v.group == operation.param1) {
                    return v
                }
            })
            if(this.checkReader.length < 1 || idx == -1) {
                this.checkReader.push({ group: operation.param1, users: [operation.param2], timeSeen: [operation.param3] });
            } else {
                for (var i = 0; i < this.checkReader.length; i++) {
                    if(this.checkReader[i].group == operation.param1) {
                        if(!this.checkReader[i].users.includes(operation.param2)) {
                            this.checkReader[i].users.push(operation.param2);
                            this.checkReader[i].timeSeen.push(operation.param3);
                        }
                    }
                }
            }
        }
    }

    command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        
        this.command('apakah ', ['ya','tidak']);
        this.command('/botid', this.getProfile.bind(this));
        this.command('/status', `Your Status: ${JSON.stringify(this.stateStatus)}`);
        this.command(`/left ${payload}`, this.leftGroupByName.bind(this));
        this.command('/speed', this.getSpeed.bind(this));
        this.command(`kick ${payload}`, this.OnOff.bind(this));
        this.command(`cancel ${payload}`, this.OnOff.bind(this));
        this.command(`qr ${payload}`, this.OnOff.bind(this));
        this.command(`tes ${payload}`,this.kickAll.bind(this));
        this.command(`/cancel ${payload}`, this.cancelMember.bind(this));
        this.command(`/point`,this.setReader.bind(this));
        this.command(`/check`,this.rechecks.bind(this));
        this.command(`/reset`,this.clearall.bind(this));
        this.command('/myid',`MID kamu: ${messages.from}`)
        this.command(`/ip ${payload}`,this.checkIP.bind(this))
        this.command(`/ig ${payload}`,this.checkIG.bind(this))
        this.command(`/open ${payload}`,this.qrOpenClose.bind(this))
        this.command(`/join ${payload}`,this.joinQr.bind(this));
        this.command(`/spam ${payload}`,this.spamGroup.bind(this));
        this.command(`/creator`,this.creator.bind(this));
        this.command(`/pic ${payload}`,this.searchLocalImage.bind(this));
        this.command(`/upload ${payload}`,this.prepareUpload.bind(this));
        this.command(`/say ${payload}`,this.vn.bind(this));
        this.command(`respon`, [`[A]ira`]);

        if(messages.contentType == 13) {
            messages.contentType = 0;
            if(!this.isAdminOrBot(messages.contentMetadata.mid)) {
                this._sendMessage(messages,messages.contentMetadata.mid);
            }
            return;
        }

        if(this.stateUpload.group == messages.to && [1,2,3].includes(messages.contentType)) {
            if(sender === this.stateUpload.sender) {
                this.doUpload(messages);
                return;
            } else {
                messages.contentType = 0;
                this._sendMessage(messages,'Wrong Sender !! Reseted');
            }
            this.resetStateUpload();
            return;
        }

        // if(cmd == 'lirik') {
        //     let lyrics = await this._searchLyrics(payload);
        //     this._sendMessage(seq,lyrics);
        // }

    }

}

module.exports = LINE;
