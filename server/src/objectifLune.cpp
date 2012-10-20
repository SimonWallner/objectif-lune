#include <objectif-lune/objectifLune.hpp>

#include <iostream>

#include "serverHandler.hpp"

using namespace objectifLune;

Server::Server(unsigned short _portNumber)
	: portNumber(_portNumber)
{}


void Server::startService()
{
	serverHandler = new objectifLune::ServerHandler();
	boost::thread serviceThread(&Server::startupThread, this);
}

void Server::waitForConnections(unsigned int timeout) const
{
//	if (
	boost::this_thread::sleep(boost::posix_time::milliseconds(timeout));
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

void Server::sendLogMessage(const std::string& logLevel, const std::string& msg) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"log\", \"payload\": {\"level\": \""
		 << logLevel
		 << "\", \"message\": \""
		 << msg
		 << "\"}}";
	
	serverHandler->broadcast(sstr.str());
}

void Server::trace(const std::string& msg) const
{
	sendLogMessage("trace", msg);
}

void Server::debug(const std::string& msg) const
{
	sendLogMessage("debug", msg);
}

void Server::info(const std::string& msg) const
{
	sendLogMessage("info", msg);
}

void Server::warn(const std::string& msg) const
{
	sendLogMessage("warn", msg);
}

void Server::error(const std::string& msg) const
{
	sendLogMessage("error", msg);
}

void Server::fatal(const std::string& msg) const
{
	sendLogMessage("fatal", msg);
}

void Server::scalar(const std::string& name, float value) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"scalar\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"value\": ";
	sstr << value;
	sstr << "}}";
	
	serverHandler->broadcast(sstr.str());
}

void Server::data(float reference, const std::string& name, float value) const
{
	std::stringstream sstr;
	sstr << "{\"type\": \"data\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"reference\": ";
	sstr << reference;
	sstr << ", \"value\": ";
	sstr << value;
	sstr << "}}";

	serverHandler->broadcast(sstr.str());
}

void Server::registerVariable(std::string name, float* pointer, float min, float max, std::string description)
{
	floatTweakingMap[name] = pointer;
	
	std::stringstream sstr;
	sstr << "{\"type\": \"floatVariable\", \"payload\": {\"name\": ";
	sstr << "\"" << name << "\"";
	sstr << ", \"value\": ";
	sstr << *pointer;
	sstr << ", \"min\": ";
	sstr << min;
	sstr << ", \"max\": ";
	sstr << max;
	sstr << ", \"description\": \"";
	sstr << description;
	sstr << "\"}}";
	
	std::cout << sstr.str() << std::endl;
	
	serverHandler->broadcast(sstr.str());
}
