#include <objectifLune.hpp>

#include <iostream>

using namespace objectifLune;

int counter = 0;

void ServerHandler::on_message(websocketpp::server::connection_ptr con,
						websocketpp::message::data_ptr msg)
{
	if (msg->get_opcode() != websocketpp::frame::opcode::TEXT) {
        return;
    }
	
	std::string payload = msg->get_payload();
	
//	std::cout << "message received: " << payload << std::endl;
	
	if (payload == "poll")
	{
		std::stringstream sstr;
		sstr << "{\"type\": \"data\", \"payload\": [" << counter % 10 << ", " << (counter + 1) % 10 << "]}";
		con->send(sstr.str(), websocketpp::frame::opcode::TEXT);
		counter += 2;
	}
}

void ServerHandler::on_close(websocketpp::server::connection_ptr con)
{
	std::cout << "-- connection closed" << std::endl;
	boost::lock_guard<boost::mutex> guard(mutex);
	connections.erase(con);
}


void ServerHandler::on_open(websocketpp::server::connection_ptr con)
{
	std::cout << "++ connection opened" << std::endl;
	boost::lock_guard<boost::mutex> guard(mutex);
	connections.insert(con);
}

// broadcast to all clients
void ServerHandler::broadcast(std::string msg) {
	boost::lock_guard<boost::mutex> guard(mutex);
	for (connection_set::const_iterator ci = connections.begin();
		 ci != connections.end();
		 ci++) {
		(*ci)->send(msg, websocketpp::frame::opcode::TEXT);
	}
}



Server::Server(unsigned short _portNumber)
: portNumber(_portNumber)
{}


void Server::startService()
{
	serverHandler = new objectifLune::ServerHandler();
	boost::thread serviceThread(&Server::startupThread, this);
}

void Server::startupThread()
{
	try
	{
		websocketpp::server::handler::ptr handle(serverHandler);
		websocketpp::server endpoint(handle);
		
		std::cout << "Starting Objectif Lune server on port " << portNumber << std::endl;
        endpoint.listen(portNumber);
	}
	catch (std::exception &e)
	{
		std::cerr << "Exception: " << e.what() << std::endl;
	}
}


void Server::broadcast(std::string datum)
{
	serverHandler->broadcast(datum);
}

void Server::sendLogMessage(std::string logLevel, std::string msg)
{
	std::stringstream sstr;
	sstr << "{\"type\": \"log\", \"level\": \""
		 << logLevel
		 << "\", \"message\": \""
		 << msg
		 << "\"}";
	
	broadcast(sstr.str());
}

void Server::info(std::string msg)
{
	sendLogMessage("info", msg);
}
