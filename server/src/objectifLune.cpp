#include <objectifLune.hpp>

#include <iostream>

using namespace objectifLune;

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

void Server::sendLogMessage(std::string logLevel, std::string msg)
{
	std::stringstream sstr;
	sstr << "{\"type\": \"log\", \"payload\": {\"level\": \""
		 << logLevel
		 << "\", \"message\": \""
		 << msg
		 << "\"}}";
	
	serverHandler->broadcast(sstr.str());
}

void Server::trace(std::string msg)
{
	sendLogMessage("trace", msg);
}

void Server::debug(std::string msg)
{
	sendLogMessage("debug", msg);
}

void Server::info(std::string msg)
{
	sendLogMessage("info", msg);
}

void Server::warn(std::string msg)
{
	sendLogMessage("warn", msg);
}

void Server::error(std::string msg)
{
	sendLogMessage("error", msg);
}

void Server::fatal(std::string msg)
{
	sendLogMessage("fatal", msg);
}

void Server::scalar(std::string name, float value)
{
	std::stringstream sstr;
	sstr << "{\"type\": \"scalar\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"value\": ";
	sstr << value;
	sstr << "}}";
	
	serverHandler->broadcast(sstr.str());
}