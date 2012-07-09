#ifndef OBJECTIF_LUNE_HPP_
#define OBJECTIF_LUNE_HPP_

#include <iostream>

#include <websocketpp.hpp>

namespace objectifLune
{
	class Server// : public websocketpp::server::handler
	{
	private:
		int portNumber;
		
	public: 
		
		Server(int portNumber = 62000);

		void hello();
		
//		void on_message(websocketpp::server::connection_ptr con,
//						websocketpp::message::data_ptr msg);
	};
}

#endif
