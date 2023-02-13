import { queueProgram, clipboard, hardDrive } from '../../../store';
import { recycle_bin_id} from '../../../system';
import { get } from 'svelte/store';
import * as fs from '../../../fs';

export let make = ({type, originator}) => {

    //originator: viewer
    

    //originator: program
    return {
        required_width: 180 + 20,
        required_height: 27*6  + 20,
        menu: [
            [
                {
                    name: 'Arrange Icons By',
                    items: [
                        {
                            name: 'Name'
                        },
                        {
                            name: 'Size'
                        },
                        {
                            name: 'Type'
                        },
                        {
                            name: 'Modified'
                        }
                    ]
                },
                {
                    name: 'Refresh',
                    action: () => {
                        console.log('refresh');
                        let nodes = document.querySelectorAll('.fs-item');
                        for(let node of nodes){
                            node.classList.add('animate-blink');
                        }
                        setTimeout(() => {
                            for(let node of nodes){
                                node.classList.remove('animate-blink');
                            }
                        }, 1000);
                    }
                    
                }
            ],
            [
                ...originator.id != recycle_bin_id ? [
                    {
                        name: 'Paste',
                        disabled: get(clipboard).length == 0,
                        action: () => {
                            fs.paste(originator.id);
                        }
                    },
                    {
                        name: 'Paste Shortcut',
                        disabled: true
                    }
                ] : []
            ],
            [
                ...originator.id != recycle_bin_id ? [
                    {
                        name: 'New',
                        items: [
                            {
                                name: 'Folder',
                                icon: '/images/xp/icons/FolderClosed.png',
                                action: () => {
                                    fs.new_fs_item('folder', '', 'New Folder', originator.id);
                                }
                            },
                            {
                                name: 'Shortcut',
                                icon: '/images/xp/icons/Shortcutoverlay.png'
                            },
                            {
                                name: 'Briefcase',
                                icon: '/images/xp/icons/Briefcase.png'
                            },
                            {
                                name: 'Bitmap Image',
                                icon: '/images/xp/icons/Bitmap.png',
                                action: () => {
                                    fs.new_fs_item('file', '.bmp', 'New Bitmap Image', originator.id);
                                }
                            },
                            {
                                name: 'Text Document',
                                icon: '/images/xp/icons/TXT.png',
                                action: () => {
                                    fs.new_fs_item('file', '.txt', 'New Text Document', originator.id);
                                }
                            },
                            {
                                name: 'Wave Sound',
                                icon: '/images/xp/icons/WMV.png',
                                action: () => {
                                    fs.new_fs_item('file', '.wav', 'New Sound', originator.id);
                                }
                            },
                            {
                                name: 'Compressed (zipped) Folder',
                                icon: '/images/xp/icons/Zipfolder.png'
                            }
    
                        ]
                    }
                ] : []
            ],
            [
                {
                    name: 'Properties',
                    action: () => {
                        let fs_item = get(hardDrive)[originator.id];
                        if(fs_item.type == 'drive' || fs_item.type == 'removable_storage'){
                            queueProgram.set({
                                path: './programs/disk_properties.svelte',
                                fs_item
                            })
                        } else {
                            queueProgram.set({
                                path: './programs/properties.svelte',
                                fs_item
                            })
                        }
                        
                    }
                }
            ]
        ]
    }
}