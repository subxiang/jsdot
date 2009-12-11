/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

Copyright (c) 2009 Lucia Blondel, Nicos Giuliani, Carlo Vanini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/	

/**
 * Array that contains some examples of the possible graphs that 
 * can be drawn with JSDot
 */
JSDot.template = [
				["Tree", '{\
							"name": "tree",\
							"directed": false,\
							"nodes": [\
				  						{"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
		          						{"name": "node2", "attributes": {"label": "b", "color": "red", "pos": "500,100"}},\
				 						{"name": "node3", "attributes": {"label": "c", "color": "yellow", "pos": "200,500"}},\
				  						{"name": "node4", "attributes": {"label": "d", "color": "green","pos": "500,500"}}\
				  					  ],\
							"edges": [\
				  						{"src": "node1", "dst": "node2", "attributes": {"label": "edge1", "style": "solid"}},\
				  						{"src": "node2", "dst": "node3", "attributes": {"label": "edge2", "style": "solid"}},\
				  						{"src": "node3", "dst": "node4", "attributes": {"label": "edge3", "style": "solid"}}\
				 					 ],\
							"attributes": {\
										"label": "unddirected graph with four nodes and three edges (connected)"\
							}\
							}'],
				["Single Node", '{\
									"name": "single node",\
									"directed": false,\
									 "nodes": [\
									 			{"name": "node1", "attributes": {"label": "a", "color": "blue", "pos": "200,100"}},\
											   ],\
									"edges": [],\
									"attributes": {\
										"label": "graph with a single node"\
									}\
								}'],
				["Binary Tree", '{\
									"name":"binary tree",\
									"directed":false,\
									"nodes":[\
											{"name":"node1","attributes":{"label":"17","color":"blue","pos":"489,58"}},\
											{"name":"node2","attributes":{"label":"19","color":"red","pos":"741,267"}},\
											{"name":"node3","attributes":{"label":"18","color":"green","pos":"642,362"}},\
											{"name":"node4","attributes":{"label":"20","color":"green","pos":"856,362"}},\
											{"name":"node5","attributes":{"label":"15","color":"red","pos":"293,265"}},\
											{"name":"node6","attributes":{"label":"16","color":"green","pos":"409,367"}},\
											{"name":"node7","attributes":{"label":"14","color":"green","pos":"186,366"}}\
											],\
									"edges":[\
											{"src":"node1","dst":"node2","attributes":{"label":"edge1","style":"solid"}},\
											{"src":"node2","dst":"node3","attributes":{"label":"edge2","style":"solid"}},\
											{"src":"node2","dst":"node4","attributes":{"label":"edge3","style":"solid"}},\
											{"src":"node1","dst":"node5","attributes":{"label":"edge4","style":"solid"}},\
											{"src":"node5","dst":"node6","attributes":{"label":"edge5","style":"solid"}},\
											{"src":"node5","dst":"node7","attributes":{"label":"edge6","style":"solid"}}\
											],\
									"attributes":{\
											"label":"binary tree example"\
											}\
								}'],
				["Generic Graph", '{\
									"name": "generic graph",\
									"directed": false,\
									"nodes":[\
											{"name":"node1","attributes":{"label":"A","color":"blue","pos":"489,58"}},\
											{"name":"node2","attributes":{"label":"B","color":"red","pos":"741,267"}},\
											{"name":"node3","attributes":{"label":"C","color":"green","pos":"642,362"}},\
											{"name":"node4","attributes":{"label":"D","color":"yellow","pos":"856,362"}},\
									],\
									"edges":[\
											{"src":"node1","dst":"node2","attributes":{"label":"edge1","style":"solid"}},\
											{"src":"node2","dst":"node3","attributes":{"label":"edge2","style":"solid"}},\
											{"src":"node3","dst":"node1","attributes":{"label":"edge3","style":"solid"}},\
									],\
									"attributes":{\
											"label":"generic graph"\
											}\
									}'],
				["Directed Graph", '{\
									"name": "directed graph",\
									"directed": true,\
									"nodes":[\
											{"name":"node1","attributes":{"label":"A","color":"blue","pos":"489,58"}},\
											{"name":"node2","attributes":{"label":"B","color":"red","pos":"741,267"}},\
											{"name":"node3","attributes":{"label":"C","color":"green","pos":"642,362"}},\
											{"name":"node4","attributes":{"label":"D","color":"yellow","pos":"856,362"}},\
									],\
									"edges":[\
											{"src":"node1","dst":"node2","attributes":{"label":"edge1","style":"solid"}},\
											{"src":"node2","dst":"node3","attributes":{"label":"edge2","style":"solid"}},\
											{"src":"node3","dst":"node1","attributes":{"label":"edge3","style":"solid"}},\
									],\
									"attributes":{\
											"label":"directed graph"\
											}\
									}']
				];
